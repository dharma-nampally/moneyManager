import {Component} from 'react'
import './index.css'
import {v4 as uuidv4} from 'uuid'
import MoneyDetails from '../MoneyDetails'
import TransactionItem from '../TransactionItem'

class MoneyManager extends Component {
  state = {
    titleInput: '',
    amountInput: '',
    optionId: 'INCOME',
    transactionHistory: [],
    balance: 0,
    income: 0,
    expenses: 0,
  }

  handleTitleChange = event => this.setState({titleInput: event.target.value})

  handleAmountChange = event => this.setState({amountInput: event.target.value})

  handleOptionChange = event => this.setState({optionId: event.target.value})

  handleAddTransaction = event => {
    event.preventDefault()
    const {titleInput, amountInput, optionId} = this.state
    if (!titleInput || !amountInput) {
      alert('Please provide both title and amount.')
      return
    }

    const newTransaction = {
      id: uuidv4(), // Updated to use UUID
      title: titleInput,
      amount: parseFloat(amountInput),
      type: optionId,
    }
    this.setState(prevState => {
      const updatedTransactionHistory = [
        ...prevState.transactionHistory,
        newTransaction,
      ]
      const updatedBalance = this.calculateBalance(updatedTransactionHistory)
      const updatedIncome = this.calculateIncome(updatedTransactionHistory)
      const updatedExpenses = this.calculateExpenses(updatedTransactionHistory)
      return {
        transactionHistory: updatedTransactionHistory,
        balance: updatedBalance,
        income: updatedIncome,
        expenses: updatedExpenses,
        titleInput: '',
        amountInput: '',
        optionId: 'INCOME',
      }
    })
  }

  calculateBalance = transactionHistory => {
    const income = this.calculateIncome(transactionHistory)
    const expenses = this.calculateExpenses(transactionHistory)
    return income - expenses
  }

  calculateIncome = transactionHistory =>
    transactionHistory
      .filter(transaction => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amount, 0)

  calculateExpenses = transactionHistory =>
    transactionHistory
      .filter(transaction => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amount, 0)

  handleDeleteTransaction = id => {
    this.setState(prevState => {
      const updatedTransactionHistory = prevState.transactionHistory.filter(
        transaction => transaction.id !== id,
      )
      const updatedBalance = this.calculateBalance(updatedTransactionHistory)
      const updatedIncome = this.calculateIncome(updatedTransactionHistory)
      const updatedExpenses = this.calculateExpenses(updatedTransactionHistory)
      return {
        transactionHistory: updatedTransactionHistory,
        balance: updatedBalance,
        income: updatedIncome,
        expenses: updatedExpenses,
      }
    })
  }

  render() {
    const {
      titleInput,
      amountInput,
      optionId,
      transactionHistory,
      balance,
      income,
      expenses,
    } = this.state
    const transactionTypeOptions = [
      {optionId: 'INCOME', displayText: 'Income'},
      {optionId: 'EXPENSE', displayText: 'Expense'}, // Corrected from EXPENSES to EXPENSE
    ]

    return (
      <div className="money-manager">
        <div className="money-manager-header">
          <h1 className="heading">Hi, Richard</h1>
          <p>Welcome back to your Money Manager</p>
        </div>
        <div className="money-manager-bg">
          <MoneyDetails balance={balance} income={income} expenses={expenses} />
          <div className="content-wrapper">
            {/* Add Transaction Section */}
            <div className="transaction-form-wrapper">
              <form className="transaction-form">
                <h2 className="heading">Add transaction</h2>
                <label className="heading" htmlFor="titleInput">
                  TITLE
                </label>
                <input
                  id="titleInput"
                  type="text"
                  placeholder="TITLE"
                  value={titleInput}
                  onChange={this.handleTitleChange}
                  aria-label="Title"
                />
                <label className="heading" htmlFor="amountid">
                  AMOUNT
                </label>
                <input
                  id="amountid"
                  type="text"
                  placeholder="AMOUNT"
                  value={amountInput}
                  onChange={this.handleAmountChange}
                  aria-label="AMOUNT"
                />
                <label className="heading" htmlFor="transactionType">
                  TYPE
                </label>
                <select
                  id="transactionType"
                  value={optionId}
                  onChange={this.handleOptionChange}
                  aria-label="Transaction Type"
                >
                  {transactionTypeOptions.map(option => (
                    <option key={option.optionId} value={option.optionId}>
                      {option.displayText}
                    </option>
                  ))}
                </select>
                <div>
                  <button
                    type="submit"
                    className="button"
                    onClick={this.handleAddTransaction}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            {/* History Section */}
            <div className="history-wrapper">
              <h2 className="heading">History</h2>
              <div className="transaction-subheadings">
                <p className="subheading title">Title</p>
                <p className="subheading amount">Amount</p>
                <p className="subheading type">Type</p>
              </div>
              <ul className="transaction-history">
                {transactionHistory.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={this.handleDeleteTransaction}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MoneyManager
