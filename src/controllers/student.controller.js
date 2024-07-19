import CompanyModel from '../models/company.schema.js';
import StudentModel from '../models/student.schema.js';

export default class StudentController{

    //get add student page
    getStudentPage = (req, res) => {

        return res.render('addStudent');
    }
    
    //post add student page data
    postStudentPageData = async (req, res) => {

        
	try {
        const { name, email, batch, college, placement, contactNumber, dsa, webd, react } = req.body;
		const student = await StudentModel.findOne({ email });

		if (student) {
			console.log('Email already exists');
			return res.redirect('students/add');
		}

		const newStudent = await StudentModel.create({
			name,
			email,
			college,
			batch,
			placement,
			contactNumber,
			dsa,
			webd,
			react,
		});
		await newStudent.save();

		return res.redirect('/');
	} catch (error) {
		console.log(`Error in postStudentPageData controller : ${error}`);
		return res.redirect('/students/add');
	}
        
    }

    //delete a student data

    deleteStudentData = async (req, res) => {

        
	try {
        const { id } = req.params;
		
		const student = await StudentModel.findById(id);

		// find the companies for which interview is scheduled for this student
		// delete student from company interviews list as well as from student collection as well
		if (student && student.interviews.length > 0) {
			for (let item of student.interviews) {


                await CompanyModel.updateOne({name: item.company},
                    {
                        $pull: {
                            "students": {student: student._id}
                        }
                    },
                )
				
			}
		}
		await StudentModel.findByIdAndDelete(id);
		res.redirect('/');
	} catch (error) {
		console.log('Error in deleteStudentData controller ', error);
		return res.redirect('/');
	}
    }
}

