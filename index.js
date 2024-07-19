import path from 'path'; 

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import ejsLayout from 'express-ejs-layouts';
import session from 'express-session';

import { connectToDB } from './src/config/coonectToDB.js';
import UserController from './src/controllers/user.controller.js';
import { auth } from './src/middlewares/auth.middleware.js';
import StudentController from './src/controllers/student.controller.js';
import CompanyController from './src/controllers/company.controller.js';
import HomeController from './src/controllers/home.controller.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));


app.use(express.static("public"));
app.use(express.static("src/views"));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({extended: true}));


app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//create an instance of usercontroller class
const userController = new UserController();

//create an instance of studentcontroller class
const  studentController = new StudentController();

// create an instance of companycontroller class
const companyController = new CompanyController();

// create an instance of HomeController class
const homeController = new HomeController();


//routes related to auth
app.get("/auth/register", userController.signup);
app.get("/auth/login", userController.signin);
app.post("/auth/register", userController.postSignUpForm);
app.post("/auth/login", userController.postSignInForm);
app.get("/auth/logout", userController.signOut);
app.get("/auth/download-csv", auth, userController.downloadCSVFile);


//routes related to student
app.get("/students/add", auth, studentController.getStudentPage);
app.post("/students/add", auth, studentController.postStudentPageData);
app.get("/students/delete/:id", auth, studentController.deleteStudentData);


//routes rleated to company
app.get("/company-list", auth, companyController.getCompanyPage);
app.get("/company/allocate-interview", auth, companyController.allocateForInterview);
app.post("/company/allocate-interview", auth, companyController.postFormDataForInterview);
app.post("/company/update-interview/:id", auth, companyController.updateInterviewData);


//routes related to homepage

app.get("/", auth, homeController.getHomePage);

const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});