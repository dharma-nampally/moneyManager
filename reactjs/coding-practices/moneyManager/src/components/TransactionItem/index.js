// Write your code here
import './index.css'

const TransactionItem = ({transaction, onDelete}) => {
  const {id, title, amount, type} = transaction

  return (
    <li className="transaction-item">
      <p className="transaction-data title">{title}</p>
      <p className="transaction-data amount">{amount}</p>
      <p className="transaction-data type">{type}</p>
      <button
        type="button"
        data-testid="delete"
        onClick={() => onDelete(id)}
        className="delete-button"
      >
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
          alt="delete"
        />
      </button>
    </li>
  )
}

export default TransactionItem
