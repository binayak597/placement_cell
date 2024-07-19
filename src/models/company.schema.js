import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
		},
		students: [
			{
				student: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Student',
				},
				date: {
					type: Date,
					required: true,
				},
				result: {
					type: String,
					enum: ['On Hold', 'Selected', 'Pending', 'Not Selected', 'Did not Attempt'],
				},
			},
		],
	},
	{ timestamps: true }
);

const CompanyModel = mongoose.model('Company', companySchema);

export default CompanyModel;


