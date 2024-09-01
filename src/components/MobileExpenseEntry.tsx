import React, { useState } from 'react';
import styled from 'styled-components';

const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const ExpenseTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const ExpenseTypeButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const AddNewButton = styled(ExpenseTypeButton)`
  background-color: ${props => props.theme.colors.secondary};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const AmountDisplay = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 24px;
  text-align: right;
  background-color: white;
  box-sizing: border-box;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const CalcButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  padding: 15px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d0d0d0;
  }

  &:active {
    background-color: #c0c0c0;
  }
`;

const SubmitButton = styled(ExpenseTypeButton)`
  width: 100%;
  padding: 15px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
`;

const CancelButton = styled(ExpenseTypeButton)`
  background-color: #e74c3c;
  margin-top: 10px;
`;

interface MobileExpenseEntryProps {
  expenseTypes: string[];
  onSubmit: (expense: { expenseType: string; amount: number; details?: string }) => void;
  onAddExpenseType: (expenseType: string) => void;
}

const MobileExpenseEntry: React.FC<MobileExpenseEntryProps> = ({
  expenseTypes,
  onSubmit,
  onAddExpenseType
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('0');
  const [newExpenseType, setNewExpenseType] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showOthersInput, setShowOthersInput] = useState(false);
  const [othersDetails, setOthersDetails] = useState('');

  const handleNumberInput = (num: string) => {
    setAmount(prev => {
      if (prev === '0') return num;
      return prev + num;
    });
  };

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(prev => prev + '.');
    }
  };

  const handleDelete = () => {
    setAmount(prev => {
      if (prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleSubmit = () => {
    if (selectedType && amount !== '0') {
      onSubmit({
        expenseType: selectedType,
        amount: parseFloat(amount),
        details: showOthersInput ? othersDetails : undefined
      });
      setSelectedType('');
      setAmount('0');
      setShowOthersInput(false);
      setOthersDetails('');
    }
  };

  const handleAddNewType = () => {
    if (isAddingNew && newExpenseType) {
      onAddExpenseType(newExpenseType);
      setNewExpenseType('');
      setIsAddingNew(false);
    } else {
      setIsAddingNew(true);
    }
  };

  const handleCancelNewType = () => {
    setIsAddingNew(false);
    setNewExpenseType('');
  };

  return (
    <EntryContainer>
      <ContentWrapper>
        <ExpenseTypeGrid>
          {expenseTypes.map(type => (
            <ExpenseTypeButton 
              key={type} 
              onClick={() => { setSelectedType(type); setShowOthersInput(false); }}
              style={selectedType === type ? { backgroundColor: '#2ecc71' } : {}}
            >
              {type}
            </ExpenseTypeButton>
          ))}
          <AddNewButton onClick={handleAddNewType}>
            {isAddingNew ? 'Confirm New' : 'Add New'}
          </AddNewButton>
          <ExpenseTypeButton onClick={() => { setSelectedType('Others'); setShowOthersInput(true); }}>
            Others
          </ExpenseTypeButton>
        </ExpenseTypeGrid>
        {isAddingNew && (
          <>
            <Input
              type="text"
              value={newExpenseType}
              onChange={(e) => setNewExpenseType(e.target.value)}
              placeholder="New expense type"
            />
            <CancelButton onClick={handleCancelNewType}>Cancel</CancelButton>
          </>
        )}
        {showOthersInput && (
          <Input
            type="text"
            value={othersDetails}
            onChange={(e) => setOthersDetails(e.target.value)}
            placeholder="Enter details"
          />
        )}
        <AmountDisplay>{amount}</AmountDisplay>
        <CalculatorGrid>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '←'].map(num => (
            <CalcButton 
              key={num} 
              onClick={() => {
                if (num === '.') handleDecimal();
                else if (num === '←') handleDelete();
                else handleNumberInput(num);
              }}
            >
              {num}
            </CalcButton>
          ))}
        </CalculatorGrid>
      </ContentWrapper>
      <SubmitButton 
        onClick={handleSubmit} 
        disabled={!selectedType || amount === '0'}
      >
        Add Expense
      </SubmitButton>
    </EntryContainer>
  );
};

export default MobileExpenseEntry;