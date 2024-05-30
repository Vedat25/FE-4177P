import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { FaTrash, FaEdit } from "react-icons/fa";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 20px;
`;

export const TextField = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: #00ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &hover {
    background-color: #282b29;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 55px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 300px;
`;

export const ListBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const EditDeleteContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

interface ItemsProps {
  id: string;
  content: string;
}

function App() {
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [newItemContent, setNewItemContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const itemsContent = [...items];
    const [removedItem] = itemsContent.splice(result.source.index, 1);
    itemsContent.splice(result.destination.index, 0, removedItem);
    setItems(itemsContent);
  };

  const addItem = () => {
    if (!newItemContent.trim()) return;
    const ListItemId = nanoid();
    const newList = {
      id: ListItemId,
      content: newItemContent,
    };
    setItems([...items, newList]);
    setNewItemContent("");
  };

  const deleteItem = (id: string) => {
    setItems((items) => {
      return items.filter((item) => item.id !== id);
    });
  };

  const openEditModal = (id: string, content: string) => {
    setOpen(true);
    setInputEdit(content);
    setSelectedId(id);
  };

  const saveEditedItem = () => {
    const selectItem = items.find((item) => item.id === selectedId);
    if (selectItem) {
      selectItem.content = inputEdit;
      setItems(...[items]);
    }
    setOpen(false);
  };

  return (
    <>
      <Container>
        <InputContainer>
          <TextField
            type="text"
            value={newItemContent}
            onChange={(e) => {
              setNewItemContent(e.target.value);
            }}
            placeholder="Yeni bir madde ekleyin..."
          ></TextField>
          <Button onClick={addItem}>Ekle</Button>
        </InputContainer>
        <ListContainer>
          <List>
            <h2>To Do List</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="myList">
                {(provider) => (
                  <div {...provider.droppableProps} ref={provider.innerRef}>
                    {items.map(({ id, content }: ItemsProps, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provider) => (
                          <ListBox
                            ref={provider.innerRef}
                            {...provider.dragHandleProps}
                            {...provider.draggableProps}
                          >
                            {content}
                            <EditDeleteContainer>
                              <Button
                                onClick={() => openEditModal(id, content)}
                              >
                                {" "}
                                <FaEdit></FaEdit>
                              </Button>
                              <Button onClick={() => deleteItem(id)}>
                                {" "}
                                <FaTrash></FaTrash>
                              </Button>
                            </EditDeleteContainer>
                          </ListBox>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </ListContainer>
      </Container>
      {open && (
        <ModalBackground>
          <ModalContainer>
            <TextField
              type="text"
              value={inputEdit}
              onChange={(e) => setInputEdit(e.target.value)}
            ></TextField>
            <Button onClick={saveEditedItem}>OK</Button>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
}

export default App;
