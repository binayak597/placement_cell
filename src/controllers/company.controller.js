import StudentModel from "../models/student.schema.js";
import CompanyModel from "../models/company.schema.js";

export default class CompanyController{

    //get company page
    getCompanyPage = async (req, res) => {

        try {
            const username = req.session?.userName;
            const students = await StudentModel.find({});
            return res.render('company', { students, username });
          } catch (error) {
            console.log(`Error in getCompanyPage controller : ${error}`);
            return res.redirect('/');
          }
    }

    //get form for allocate interview
    allocateForInterview = async (req, res) => {

        try {
          const username = req.session?.userName;
            const students = await StudentModel.find({});
        
            return res.render('allocateInterview', { students, username });
          } catch (error) {
            console.log(`Error in allocating interview: ${error}`);
            return res.redirect('/company-list');
          }
    }

    //post allocate interview form data

    postFormDataForInterview = async (req, res) => {

        
  try {
    const { id, company, date } = req.body;
    const existingCompany = await CompanyModel.findOne({ name: company });
    const obj = {
      student: id,
      date,
      result: 'Pending',
    };
    // if company doesnt exist
    if (!existingCompany) {
      const newCompany = await CompanyModel.create({
        name: company,
      });
      newCompany.students.push(obj);
      newCompany.save();
    } else {
      for (let studentObj of existingCompany.students) {
        // if student id already exists
        if (studentObj.student.toString() === id) {
          console.log('Interview with this student already scheduled');
          return res.redirect("/company-list");
        }
      }
      existingCompany.students.push(obj);
      await existingCompany.save();
    }

    const student = await StudentModel.findById(id);

    if (student) {
      const interview = {
        company,
        date,
        result: 'Pending',
      };
      student.interviews.push(interview);
      await student.save();
    }
    console.log('Interview Scheduled Successfully');
    return res.redirect('/company-list');
  } catch (error) {
    console.log(`Error in postFormDataForInterview controller : ${error}`);
    return res.redirect("/company-list");
  }

    }

    //update student interview data

    updateInterviewData = async (req, res) => {

      
  try {

    const { id } = req.params;
    const { companyName, interviewDate, companyResult } = req.body;
    const student = await StudentModel.findById(id);


    //to avoid the race condition

    //perform updation in student collection
    await StudentModel.findByIdAndUpdate(id, {

      $pull: {
        interviews: {
          company: companyName,
        }
      }
    });

    await StudentModel.findByIdAndUpdate(id, {

      $push: {
        interviews: {
          company: companyName,
          date: interviewDate,
          result: companyResult
        }
      }
    })


    //perform updation in company collection
    await CompanyModel.updateOne({name: companyName},
      {
        $pull: {
          students: {
            student: student._id
          }
        }
      }
    )

    await CompanyModel.updateOne({name: companyName},
      {
        $push: {
          students: {
            student: student._id,
            date: new Date(interviewDate),
            result: companyResult
          }
        }
      }
    )

    console.log('Interview Status Changed Successfully');
    return res.redirect('/company-list');

  } catch (error) {
    console.log(`Error in updating status: ${error}`);
    res.redirect('/company-list');
  }
    }

}


