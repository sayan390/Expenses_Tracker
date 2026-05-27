import React from 'react'
import { modelStyles } from "../assets/dummyStyles";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Salary", "Freelance", "Investments","Bonus" , "Other"],
  color = "teal"
}) => {
  if (!showModal) return null;

  // Get current date in YYYY-MM-DD format
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDate = today.toISOString().split('T')[0];
  const minDate = `${currentYear}-01-01`;

  const colorClass = modalStyles.colorClasses[color];
}


          
    return(
       <div className={modelStyles.overlay}>
        <div className={modelStyles.modelContainer}>
            <div className={modelStyles.modelHeader}>
                <h3 className={modelStyles.modelTitle}>
                    {title}
                </h3>
                <button onClick={() => setShowModel(false)}
                    className={modelStyles.closeButton}>
                        <X size={24}/>
                    </button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleAddTransaction();
            }}>
                <div className={modelStyles.form}>
                    <div>
                        <label className={modelStyles.label}>Description</label>
                        <input type="text" value={newTransaction.description}
                        onChange={(e)  => 
                            setNewTransaction((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        className={modelStyles.input(colorClass.ring)}
                       placeholder={
                        type === "both"
                        ? "Salary, Funds, etc."
                        : "Groceries, Rent, etc."
                       } required
                    
                        />
                    </div>

                     <div>
                        <label className={modelStyles.label}>Amount</label>
                        <input type="number" value={newTransaction.amount}
                        onChange={(e)  => 
                            setNewTransaction((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        className={modelStyles.input(colorClass.ring)}
                       placeholder="0.00"
                        required
                    
                        />
                    </div>
                      {type === "both" && (
              <div>
                <label className={modalStyles.label}>Type</label>
                <div className={modalStyles.typeButtonContainer}>
                  <button 
                    type="button"
                    className={modalStyles.typeButton(
                      newTransaction.type === 'income', 
                      modalStyles.colorClasses.teal.typeButtonSelected
                    )}
                    onClick={() => setNewTransaction(prev => ({...prev, type: 'income'}))}
                  >
                    Income
                  </button>
                  <button 
                    type="button"
                    className={modalStyles.typeButton(
                      newTransaction.type === 'expense', 
                      modalStyles.colorClasses.orange.typeButtonSelected
                    )}
                    onClick={() => setNewTransaction(prev => ({...prev, type: 'expense'}))}
                  >
                    Expense
                  </button>
                </div>
              </div>
            )}

            <div>
                <label className={modelStyles.label}>Category</label>
                <select value={newTransaction.category}
                onChange={(e) => 
                    setNewTransaction((prev) => ({
                        ...prev,
                        category: e.target.value
                    }))
                } className={modelStyles.input(colorClass.ring)}>
                    {categories.map((cat) => (
                        <option value={cat} key={cat}>{cat}</option>
                    ))}
                </select>
            </div>
                 <label className={modelStyles.label}>Date</label>
                  <input 
                  type="data" 
                  value={newTransaction.date} 
                  onChange={(e) => 
                    newTransaction((prev) => ({
                        ...prev,
                        date: e.target.value,
                    }))
                  }
                  className={modelStyle.input(colorClass.ring)}
                  min={minDate}
                  max={currentDate}
                  required
                  />
                </div>
                <button
                type="submit"
                className={modelStyles.submitButton(colorClass.button)} >
                    {buttonText}
                </button>
            </form>
        </div>
       </div>
    )
}
export default AddTransactionModal;