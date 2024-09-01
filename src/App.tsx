import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import MobileExpenseEntry from './components/MobileExpenseEntry';
import ExpenseList from './components/ExpenseList';
import Toast from './components/Toast';
import Auth from './components/Auth';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';
import ErrorBoundary from './ErrorBoundary';
import { Menu, X } from 'lucide-react';


const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f0f0f0',
    text: '#333',
    white: '#ffffff',
  },
  fonts: {
    main: "'Roboto', sans-serif",
  },
};

const AppWrapper = styled.div`
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  font-family: ${props => props.theme.fonts.main};
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  
  @media (min-width: 768px) {
    max-width: 400px;
    height: 600px;
    margin: 20px auto;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.white};
  font-size: 24px;
  cursor: pointer;
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
`;

const MenuContent = styled.div`
  background-color: ${props => props.theme.colors.white};
  width: 70%;
  max-width: 300px;
  height: 100%;
  padding: 20px;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const ToggleButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: 10px 15px;
  margin: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const ExportButton = styled(ToggleButton)`
  margin-top: 20px;
`;

interface Expense {
  id: string;
  expenseType: string;
  amount: number;
  date: Date;
  userId: string;
  details?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showList, setShowList] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState(['Groceries', 'Fuel', 'Rent', 'Utilities', 'Entertainment']);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchExpenses(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchExpenses = async (userId: string) => {
    const expensesCollection = collection(db, 'expenses');
    const userExpensesQuery = query(expensesCollection, where("userId", "==", userId));
    const expenseSnapshot = await getDocs(userExpensesQuery);
    const expenseList = expenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Expense[];
    setExpenses(expenseList);
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expense,
      date: new Date(),
      userId: user.uid
    });
    const newExpense = { ...expense, id: docRef.id, date: new Date(), userId: user.uid };
    setExpenses([newExpense, ...expenses]);
    showToastMessage("Expense added successfully!");
  };

  const handleEditExpense = async (updatedExpense: Expense) => {
    if (!user) return;
    const expenseRef = doc(db, 'expenses', updatedExpense.id);
    await updateDoc(expenseRef, {
      expenseType: updatedExpense.expenseType,
      amount: updatedExpense.amount,
      date: updatedExpense.date,
      details: updatedExpense.details
    });
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    showToastMessage("Expense updated successfully!");
  };

  const handleDeleteExpense = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'expenses', id));
    setExpenses(expenses.filter(exp => exp.id !== id));
    showToastMessage("Expense deleted successfully!");
  };

  const handleAddExpenseType = (newExpenseType: string) => {
    setExpenseTypes([...expenseTypes, newExpenseType]);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setExpenses([]);
      showToastMessage("Logged out successfully!");
    }).catch((error) => {
      console.error("Error signing out: ", error);
      showToastMessage("Error logging out. Please try again.");
    });
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExportCSV = () => {
    const csvContent = generateCSV(expenses);
    if (isMobile()) {
      if (navigator.share) {
        navigator.share({
          files: [new File([csvContent], 'expenses.csv', { type: 'text/csv' })],
          title: 'Expenses CSV',
          text: 'Here are your exported expenses.'
        }).catch(console.error);
      } else {
        downloadCSV(csvContent, 'expenses.csv');
      }
    } else {
      downloadCSV(csvContent, 'expenses.csv');
    }
  };

  const generateCSV = (expenses: Expense[]) => {
    const headers = ['Date', 'Type', 'Amount', 'Details'];
    const rows = expenses.map(e => [
      e.date.toLocaleDateString(),
      e.expenseType,
      e.amount.toFixed(2),
      e.details || ''
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {!user ? (
          <Auth onUserAuth={setUser} />
        ) : (
          <AppWrapper>
            <Header>
              <MenuButton onClick={() => setMenuOpen(true)}><Menu /></MenuButton>
              <Logo>Scrooge</Logo>
            </Header>
            {menuOpen && (
              <MenuOverlay onClick={() => setMenuOpen(false)}>
                <MenuContent onClick={e => e.stopPropagation()}>
                  <MenuButton onClick={() => setMenuOpen(false)} style={{float: 'right'}}><X /></MenuButton>
                  <MenuItem>{user.email}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuContent>
              </MenuOverlay>
            )}
            <ToggleButton onClick={() => setShowList(!showList)}>
              {showList ? 'Add Expense' : 'View Expenses'}
            </ToggleButton>
            {showList ? (
              <>
                <ExpenseList 
                  expenses={expenses} 
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <ExportButton onClick={handleExportCSV}>Export to CSV</ExportButton>
              </>
            ) : (
              <MobileExpenseEntry
                expenseTypes={expenseTypes}
                onSubmit={handleAddExpense}
                onAddExpenseType={handleAddExpenseType}
              />
            )}
            {showToast && <Toast message={toastMessage} />}
          </AppWrapper>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;