import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  padding: 15px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
`;

const ExpenseItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExpenseDetails = styled.div`
  flex-grow: 1;
`;

const ExpenseType = styled.div`
  font-weight: bold;
  color: #3498db;
`;

const ExpenseAmount = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  margin-left: 10px;
  font-size: 0.9em;

  &:hover {
    text-decoration: underline;
  }
`;

interface Expense {
  id: string;
  expenseType: string;
  amount: number;
  date: Date;
  userId: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEditExpense, onDeleteExpense }) => {
  return (
    <ListContainer>
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id}>
          <ExpenseDetails>
            <ExpenseType>{expense.expenseType}</ExpenseType>
            <div>{expense.date.toLocaleDateString()}</div>
          </ExpenseDetails>
          <ExpenseAmount>Rs {expense.amount.toFixed(2)}</ExpenseAmount>
          <div>
            <ActionButton onClick={() => onEditExpense(expense)}>Edit</ActionButton>
            <ActionButton onClick={() => onDeleteExpense(expense.id)}>Delete</ActionButton>
          </div>
        </ExpenseItem>
      ))}
    </ListContainer>
  );
};

export default ExpenseList;