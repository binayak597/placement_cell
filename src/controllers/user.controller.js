import UserModel from '../models/user.schema.js';
import StudentModel from '../models/student.schema.js';
import fs from 'fs';
// const fastcsv = require('fast-csv');

// render sign up page

export default class UserController {

    //get signup form
     signup = (req, res) => {

        return res.render('signup');
    }

    //get signin form

     signin = (req, res) => {
        return res.render('signin');
    }

    //post signup form data 

     postSignUpForm = async (req, res) => {
        
	try {
        const { name, email, password, confirmPassword } = req.body;

		if (password !== confirmPassword) {
			console.log(`Passwords dont match`);
			return res.redirect('/auth/register');
		}
		const user = await UserModel.findOne({ email });

		if (user) {
			console.log(`Email already exists`);
			return res.redirect('/auth/register');
		}

		const newUser = await UserModel.create({
			name,
			email,
			password,
		});

		await newUser.save();

		if (!newUser) {
			console.log(`Error in creating user`);
			return res.redirect("/auth/register");
		}

		return res.redirect('/auth/login');
	} catch (error) {
		console.log(`Error in postSignUpForm: ${error}`);
		res.redirect('/auth/login');
	}
    }

    //post signin form data 

     postSignInForm = async (req, res) => {
        
        try {
            const {email, password} = req.body;
        const userFound = await UserModel.findOne({email});
        if(userFound){
            req.session.userEmail = email;
            req.session.userName = userFound.name; 

            return res.redirect("/");
        }
        return res.redirect("/auth/login");
        } catch (error) {
            console.log(`Error in postSignInForm: ${error}`);
		    res.redirect('/auth/login');
        }
    }

    //logout

     signOut = (req, res) => {

        //destory the session
        req.session.destroy(err => {
            if(err){
                console.log(err);
            }else{
                //clear the cookies
                res.redirect("/auth/login");  
            }
        });
    }

    //download csv report
     downloadCSVFile = async (req, res) => {

        try {
            const students = await StudentModel.find({});
    
            let data = '';
            let no = 1;
            let csv = 'SL.No, Name, Email, College, PlacementDetails, Contact Number, Batch, DSA Score, WebDev Score, React Score, CompanyFor Interview, Date Scheduled, Result';
    
            for (let student of students) {
                data =
                    no +
                    ',' +
                    student.name +
                    ',' +
                    student.email +
                    ',' +
                    student.college +
                    ',' +
                    student.placement +
                    ',' +
                    student.contactNumber +
                    ',' +
                    student.batch +
                    ',' +
                    student.dsa +
                    ',' +
                    student.webd +
                    ',' +
                    student.react;
    
                if (student.interviews.length > 0) {
                    for (let interview of student.interviews) {
                        data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
                    }
                }
                no++;
                csv += '\n' + data;
            }
    
            const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
                if (error) {
                    console.log(error);
                    return res.redirect('/');
                }
                console.log('Report generated successfully');
                return res.download('report/data.csv');
            });
        } catch (error) {
            console.log(`Error in downloadCSVFile: ${error}`);
            return res.redirect('/');
        }
    }

}

