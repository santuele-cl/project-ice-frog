import { Department, Gender, Role } from "@prisma/client";
import { Step } from "./types";

export const EXPIRES_IN_ONE_HOUR = new Date(
  new Date().getTime() + 60 * 60 * 1000
);
export const EXPIRES_IN_15_MIN = new Date(
  new Date().getTime() + 15 * 60 * 1000
);

export const STEPS: Step[] = [
  {
    id: 0,
    label: "Personal Information",
    description: "Input the information needed to identity you",
    fields: [
      { id: "fname", label: "First Name" },
      { id: "mname", label: "Middle Name" },
      { id: "lname", label: "Last Name" },
      { id: "suffix", label: "Suffix" },
      {
        id: "gender",
        label: "Gender",
        type: "select",
        options: [
          { value: Gender.MALE, label: "Male" },
          { value: Gender.FEMALE, label: "Female" },
        ],
      },
      { id: "bdate", label: "", type: "date" },
      { id: "age", label: "Age", type: "number" },
      { id: "contactNumber", label: "Contact Number" },
      { id: "occupation", label: "Occupation" },
      {
        id: "department",
        label: "Department",
        type: "select",
        options: [
          { value: Department.CUSTOMIZED, label: "Customized Department" },
          { value: Department.TECHNOLOGY, label: "Technology Department" },
          { value: Department.SYSTEMS, label: "Systems Department" },
        ],
      },
      {
        id: "role",
        label: "Role",
        type: "select",
        options: [
          { value: Role.ADMIN, label: "Admin" },
          { value: Role.EMPLOYEE, label: "Employee" },
        ],
      },
      { id: "email", label: "Email" },
      { id: "password", label: "Password", type: "password" },
      { id: "confirmPassword", label: "Confirm Password", type: "password" },
    ],
  },

  {
    id: 3,
    label: "Consent",
    fields: [
      {
        id: "consent",
        label:
          "I confirm that I have read and understood the Salus Privacy and Consent Form, and I voluntarily consent to the collection, use, and disclosure of my personal health information as described herein.",
        type: "checkbox",
      },
    ],
  },
];
