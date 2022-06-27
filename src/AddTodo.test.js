import { render, screen, fireEvent, getRoles} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// test('test that App component renders Task', () => {
//   render(<App />);
//   const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
//   const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
//   const element = screen.getByRole('button', {name: /Add/i});
//   const dueDate = "10/31/2023";
//   fireEvent.change(inputTask, { target: { value: "History Test"}});
//   fireEvent.change(inputDate, { target: { value: dueDate}});
//   fireEvent.click(element);
//   const check = screen.getByText(/History Test/i);
//   const checkDate = screen.getByText(new RegExp(dueDate, "i"));
//   expect(check).toBeInTheDocument();
//   expect(checkDate).toBeInTheDocument();
//  });

 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const task = "Math test";
  const dueDate = "10/10/2023";

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  // attempts to add three duplicate tasks
  for (let i = 0; i < 3; i++) {
    fireEvent.change(inputTask, { target: { value: task}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
  }
  
  const check = screen.getAllByText(/Math Test/i)
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));

  expect(check.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);

  // task name is empty
  const task = "";
  const dueDate = "11/15/2023";

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: task}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  const check = screen.queryByText(/You have no todo's left/i);

  expect(check).toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  
  // due date is empty
  const task = "Science Test";
  const dueDate = "";

  // due date is null
  const task2 = "Engineering Test";
  const dueDate2 = null;
  
  // invalid date
  const task3 = "Statistics Test";
  const dueDate3 = "21/40/2023";

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: task}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: task2}});
  fireEvent.change(inputDate, { target: { value: dueDate2}});
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: task3}});
  fireEvent.change(inputDate, { target: { value: dueDate3}});
  fireEvent.click(element);

  const checkDate = screen.queryByText(/You have no todo's left/i);

  expect(checkDate).toBeInTheDocument();
  
 });


 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const task = "Science Test";
  const dueDate = "10/12/2022";
  const task2 = "Engineering Test";
  const dueDate2 =  "10/18/2022";
  const task3 = "Statistics Test";
  const dueDate3 = "11/17/2023";

  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: task}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);

  // deletes via checkbox the Science Test task
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  fireEvent.change(inputTask, { target: { value: task2}});
  fireEvent.change(inputDate, { target: { value: dueDate2}});
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: task3}});
  fireEvent.change(inputDate, { target: { value: dueDate3}});
  fireEvent.click(element);
  
  const check = screen.getAllByText(/ Test/i);
  const check2 = screen.getByText(/Engineering Test/i);
  const check3 = screen.getByText(/Statistics Test/i);
  expect(check.length).toBe(2);
  expect(check2).toBeInTheDocument();
  expect(check3).toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/31/2022";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const historyCheck = screen.getByTestId(/History Test/i).style.background;
  
  expect(historyCheck).toBe("red");
 });
