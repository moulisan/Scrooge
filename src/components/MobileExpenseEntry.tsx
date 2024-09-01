import React, { useState } from 'react';
import styled from 'styled-components';

const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  font-family: 'Arial', sans-serif;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-bottom: 8px;
`;

const ExpenseTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
`;

const ExpenseTypeButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
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
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 20px;
  text-align: right;
  background-color: white;
  box-sizing: border-box;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
`;

const CalcButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
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
  padding: 12px;
  font-size: 14px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
`;

const CancelButton = styled(ExpenseTypeButton)`
  background-color: #e74c3c;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 8px;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #e74c3c;
  border: none;
  font-size: 10px;
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

interface MobileExpenseEntryProps {
  expenseTypes: string[];
  onSubmit: (expense: { expenseType: string; amount: number; details?: string }) => void;
  onAddExpenseType: (expenseType: string) => void;
  onRemoveExpenseType: (expenseType: string) => void;
}

const MobileExpenseEntry: React.FC<MobileExpenseEntryProps> = ({
  expenseTypes,
  onSubmit,
  onAddExpenseType,
  onRemoveExpenseType
}) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [newExpenseType, setNewExpenseType] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [showOthersInput, setShowOthersInput] = useState<boolean>(false);
  const [othersDetails, setOthersDetails] = useState<string>('');

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
      const expenseData: { expenseType: string; amount: number; details?: string } = {
        expenseType: selectedType,
        amount: parseFloat(amount),
      };
      if (showOthersInput && othersDetails.trim() !== '') {
        expenseData.details = othersDetails.trim();
      }
      onSubmit(expenseData);
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

  const handleRemoveExpenseType = (type: string) => {
    if (window.confirm(`Are you sure you want to remove "${type}" expense type?`)) {
      onRemoveExpenseType(type);
      if (selectedType === type) {
        setSelectedType('');
      }
    }
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
              <RemoveButton onClick={(e) => { e.stopPropagation(); handleRemoveExpenseType(type); }}>×</RemoveButton>
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
      <ButtonContainer>
        <SubmitButton 
          onClick={handleSubmit} 
          disabled={!selectedType || amount === '0'}
        >
          Add Expense
        </SubmitButton>
      </ButtonContainer>
    </EntryContainer>
  );
};

export default MobileExpenseEntry;