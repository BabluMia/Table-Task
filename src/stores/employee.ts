// stores/dataStore.ts
import { defineStore } from "pinia";

export interface Employee {
  id: number;
  employee_name: string;
  identification_number: string;
  date_time_get_to_work: string;
  date_time_out_of_office: string;
  date_time_reenter_office: string;
  date_time_back_to_work: string;
  status_presence: string;
  type_noncompliance: string;
  actions: string[];
}

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    employees: [] as Employee[],
    filteredEmployees: [] as Employee[],
  }),
  actions: {
    loadEmployees() {
      this.employees = [
        {
          id: 1,
          employee_name: "Ayesha Siddiqua",
          identification_number: "EMP001",
          date_time_get_to_work: "2024-04-10 08:00",
          date_time_out_of_office: "2024-04-10 17:00",
          date_time_reenter_office: "2024-04-10 14:00",
          date_time_back_to_work: "2024-04-10 14:30",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
        {
          id: 2,
          employee_name: "Farhan Islam",
          identification_number: "EMP002",
          date_time_get_to_work: "2024-04-09 08:15",
          date_time_out_of_office: "2024-04-09 17:15",
          date_time_reenter_office: "2024-04-09 12:00",
          date_time_back_to_work: "2024-04-09 13:00",
          status_presence: "Late",
          type_noncompliance: "Late Arrival",
          actions: ["Edit"],
        },
        {
          id: 3,
          employee_name: "Nusrat Jahan",
          identification_number: "EMP003",
          date_time_get_to_work: "2024-04-08 08:05",
          date_time_out_of_office: "2024-04-08 17:00",
          date_time_reenter_office: "2024-04-08 12:00",
          date_time_back_to_work: "2024-04-08 12:30",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
        {
          id: 4,
          employee_name: "Tariqul Hasan",
          identification_number: "EMP004",
          date_time_get_to_work: "2024-04-10 07:50",
          date_time_out_of_office: "2024-04-10 16:45",
          date_time_reenter_office: "2024-04-10 13:30",
          date_time_back_to_work: "2024-04-10 14:00",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
        {
          id: 5,
          employee_name: "Mousumi Akter",
          identification_number: "EMP005",
          date_time_get_to_work: "2024-04-09 08:20",
          date_time_out_of_office: "2024-04-09 17:10",
          date_time_reenter_office: "2024-04-09 12:10",
          date_time_back_to_work: "2024-04-09 12:45",
          status_presence: "Late",
          type_noncompliance: "Late Arrival",
          actions: ["Edit"],
        },
        {
          id: 6,
          employee_name: "Rajib Hossain",
          identification_number: "EMP006",
          date_time_get_to_work: "2024-04-08 08:00",
          date_time_out_of_office: "2024-04-08 17:00",
          date_time_reenter_office: "2024-04-08 13:00",
          date_time_back_to_work: "2024-04-08 13:30",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
        {
          id: 7,
          employee_name: "Tasnim Rahman",
          identification_number: "EMP007",
          date_time_get_to_work: "2024-04-07 09:00",
          date_time_out_of_office: "2024-04-07 18:00",
          date_time_reenter_office: "2024-04-07 14:00",
          date_time_back_to_work: "2024-04-07 14:45",
          status_presence: "Late",
          type_noncompliance: "Extended Break",
          actions: ["Edit"],
        },
        {
          id: 8,
          employee_name: "Shafiqul Islam",
          identification_number: "EMP008",
          date_time_get_to_work: "2024-04-06 08:10",
          date_time_out_of_office: "2024-04-06 17:05",
          date_time_reenter_office: "2024-04-06 13:15",
          date_time_back_to_work: "2024-04-06 13:40",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
        {
          id: 9,
          employee_name: "Humaira Begum",
          identification_number: "EMP009",
          date_time_get_to_work: "2024-04-05 08:25",
          date_time_out_of_office: "2024-04-05 17:20",
          date_time_reenter_office: "2024-04-05 12:05",
          date_time_back_to_work: "2024-04-05 12:50",
          status_presence: "Late",
          type_noncompliance: "Uninformed Late Arrival",
          actions: ["Edit"],
        },
        {
          id: 10,
          employee_name: "Zayed Khan",
          identification_number: "EMP010",
          date_time_get_to_work: "2024-04-04 08:00",
          date_time_out_of_office: "2024-04-04 16:55",
          date_time_reenter_office: "2024-04-04 13:10",
          date_time_back_to_work: "2024-04-04 13:30",
          status_presence: "Present",
          type_noncompliance: "None",
          actions: ["Edit"],
        },
      ];
      this.filteredEmployees = [...this.employees];
    },
    createEmployee(payload: Omit<Employee, "id" | "actions">) {
      const newEmployee = {
        id: this.employees.length + 1,
        ...payload,
        actions: ["Edit", "Delete"],
      };
      this.employees = [...this.employees, newEmployee];
      this.filteredEmployees = [...this.employees]; // Reset filtered employees to include the new employee
      this._updateFilteredEmployees();
      return newEmployee;
    },
    updateEmployee(payload: Partial<Employee> & { id: number }) {
      const index = this.employees.findIndex((emp) => emp.id === payload.id);
      if (index !== -1) {
        this.employees[index] = {
          ...this.employees[index],
          ...payload,
          actions: ["Edit", "Delete"],
        };
        this._updateFilteredEmployees();
        return this.employees[index];
      }
      return null;
    },

    filterData(employee_name: string, identification_number: string) {
      this.filteredEmployees = this.employees.filter((emp) => {
        // Check if employee_name matches more than one letter of the name in data
        const nameMatch =
          employee_name.trim().length > 1
            ? emp.employee_name.toLowerCase().includes(employee_name.trim().toLowerCase())
            : true; // If input is 1 letter or empty, skip this filter condition

        // Check if identification_number matches more than one letter of the ID in data
        const idMatch =
          identification_number.trim().length > 1
            ? emp.identification_number.includes(identification_number.trim())
            : true; // If input is 1 letter or empty, skip this filter condition

        return nameMatch && idMatch;
      });
    },
    resetEmployees() {
      this.filteredEmployees = [...this.employees];
    },
    _updateFilteredEmployees() {
      if (this.filteredEmployees.length !== this.employees.length) {
        this.filterData("", "");
      } else {
        this.resetEmployees();
      }
    },
  },
  getters: {
    getEmployees: (state) => state.employees,
    getEmployeeById: (state) => (id: number) => state.employees.find((emp) => emp.id === id),
  },
});
