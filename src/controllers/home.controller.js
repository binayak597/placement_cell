import StudentModel from "../models/student.schema.js";


export default class HomeController{

    //get home page
    getHomePage = async (req, res) => {
        const username = req.session?.userName;
        const students = await StudentModel.find({});
        return res.render('home', { students, username });

    }
}
