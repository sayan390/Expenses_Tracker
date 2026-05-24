import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from 'xlsx';

//add expenses

export async function addExpense(req, res) {
     const userId = req.user._id
    const {description, amount, category, date} = req.body;

    try {
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
           
        }
         const newExpense = new expenseModel({
                userId,
                description,
                amount,
                category,
                date: new Date(date)
            });
            await newExpense.save()
            res.json({
                success: true,
                message: "Expenses added Successfuly.."
            })
    }

   catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// to all expenses

export async function getAllExpense(req, res) {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1});
        res.json(expense);
    } 
    catch (error) {
         console.log(error);
         res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// to update the expenses

export async function updateExpense (req, res) {
    const {id} = req.params;
    const userId = req.user._id;
    const {description, amount} = req.body;
    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            {_id: id, userId},
            { description, amount},
            { new: true }
        );

        if(!updatedExpense){
           return res.status(404).json({
            success: false,
            message: "Expense not found"
           });
        }   
        res.json({
            success: true, message: "Expense updated successfully.", data:
            updatedExpense
        });
    }
    catch (error) {
        console.log(error);
         res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

//delete an expense

export async function deleteExpense(req, res) {
    try {
        const expense = await expenseModel.findByIdAndDelete({_id: req.params.id });
        if(!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }
        return res.json({
            success: true,
            message: "Expense deleted successfull"
        });
    } 
    catch (error) {
        console.log(error);
         res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

//download excel for expense

export async function downloadExpenseExcel (req, res) {
     const userId = req.user._id;
    try {
        const expense = await expenseModel.find({userId}).sort({date: -1});
        const plainData = expense.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Data: new Date(exp.data).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
        XLSX.writeFile(workbook, "Expense_details.xlsx");
        res.download("Expense_details.xlsx");
    } 
    catch (error) {
       console.log(error);
         res.status(500).json({
            success: false,
            message: "Server Error"
        }); 
    }
}

// to get overview of expense
export async function getExpenseOverview(req, res) {
     try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);

        const expense = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1});

        

        const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
        const numberOfTransactions = expense.length;
        const recentTransactions = expense.slice(0, 5);

        res,json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    } 
    catch (error) {
        console.log(error);
         res.status(500).json({
            success: false,
            message: "Server Error"
        }); 
    }
}