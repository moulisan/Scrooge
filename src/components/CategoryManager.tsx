import React, { useState } from 'react';
import styled from 'styled-components';

const ManagerContainer = styled.div`
  padding: 15px;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ItemListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.9em;

  &:hover {
    text-decoration: underline;
  }
`;

const AddNewLink = styled(ActionLink)`
  display: block;
  margin-top: 15px;
`;

interface CategoryManagerProps {
  items: string[];
  onAddItem: (item: string) => void;
  onEditItem: (oldItem: string, newItem: string) => void;
  onDeleteItem: (item: string) => void;
  itemType: 'category' | 'expenseType';
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  itemType
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
      setIsAdding(false);
    }
  };

  const handleEditItem = (oldItem: string) => {
    if (newItemName.trim() && newItemName !== oldItem) {
      onEditItem(oldItem, newItemName.trim());
      setNewItemName('');
      setEditingItem(null);
    }
  };

  return (
    <ManagerContainer>
      <h3>{itemType === 'category' ? 'Categories' : 'Expense Types'}</h3>
      <ItemList>
        {items.map(item => (
          <ItemListItem key={item}>
            {editingItem === item ? (
              <>
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onBlur={() => handleEditItem(item)}
                />
                <ActionLink onClick={() => handleEditItem(item)}>Save</ActionLink>
              </>
            ) : (
              <>
                {item}
                <div>
                  <ActionLink onClick={() => { setEditingItem(item); setNewItemName(item); }}>Edit</ActionLink>
                  <ActionLink onClick={() => onDeleteItem(item)}>Delete</ActionLink>
                </div>
              </>
            )}
          </ItemListItem>
        ))}
      </ItemList>
      {isAdding ? (
        <div>
          <input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`New ${itemType}`}
          />
          <ActionLink onClick={handleAddItem}>Add</ActionLink>
        </div>
      ) : (
        <AddNewLink onClick={() => setIsAdding(true)}>
          Add new {itemType}
        </AddNewLink>
      )}
    </ManagerContainer>
  );
};

export default CategoryManager;