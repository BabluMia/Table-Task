<template>
  <DxPopup
    :visible="visible"
    :width="900"
    :height="690"
    :show-title="true"
    :title="type === 'edit' ? 'Edit Attendance ' : 'Add Attendance '"
    :drag-enabled="false"
    :hide-on-outside-click="true"
    :show-close-button="true"
    @hiding="onClose"
    class="attendance-modal"
  >
    <template #content>
      <form @submit.prevent="saveData" class="p-6 mb-8">
        <div class="grid mb-8 grid-cols-1 md:grid-cols-1 gap-6">
          <!-- Type of Reason -->
          <div class="">
            <label class="block text-sm font-medium text-gray-800">{{ $t("add.tor") }}</label>
            <DxSelectBox
              :dataSource="reasonTypes"
              displayExpr="text"
              valueExpr="id"
              :value="form.reasonType"
              :searchEnabled="true"
              stylingMode="filled"
              class="w-full"
              @valueChanged="(e) => (form.reasonType = e.value)"
            />
          </div>

          <!-- Employee Name -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700">{{ $t("add.name") }}</label>
            <DxTextBox
              :value="form.reason"
              stylingMode="filled"
              placeholder="Enter employee name"
              class="w-full"
              @valueChanged="(e) => (form.reason = e.value)"
            />
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t("add.id") }}</label>
            <DxTextBox
              :value="form.notes"
              stylingMode="filled"
              placeholder="Enter ID "
              class="w-full"
              @valueChanged="(e) => (form.notes = e.value)"
            />
          </div>

          <!-- Got to Work -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t("add.gtw") }}</label>
            <DxDateBox
              type="datetime"
              :value="form.newStartDate || undefined"
              stylingMode="filled"
              class="w-full"
              @valueChanged="(e) => (form.newStartDate = e.value)"
            />
          </div>

          <!-- Left Office -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t("add.lo") }}</label>
            <DxDateBox
              type="datetime"
              :value="form.newOfficeOpenDate || undefined"
              stylingMode="filled"
              class="w-full"
              @valueChanged="(e) => (form.newOfficeOpenDate = e.value)"
            />
          </div>

          <!-- Re-entered -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t("add.reent")
            }}</label>
            <DxDateBox
              type="datetime"
              :value="form.newOfficeReEntryDate || undefined"
              stylingMode="filled"
              class="w-full"
              @valueChanged="(e) => (form.newOfficeReEntryDate = e.value)"
            />
          </div>

          <!-- Back to Work -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t("add.bctw") }}</label>
            <DxDateBox
              type="datetime"
              :value="form.newReturnWorkDate || undefined"
              stylingMode="filled"
              class="w-full"
              @valueChanged="(e) => (form.newReturnWorkDate = e.value)"
            />
          </div>

          <!-- File Upload -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t("add.Attachment")
            }}</label>
            <DxFileUploader
              :multiple="false"
              selectButtonText="Choose File"
              labelText="or Drop File Here"
              class="w-full"
            />
          </div>

          <!-- Action Buttons -->
        <div class="flex justify-center mb-6 gap-4 ">
          <DxButton
            text="Save"
            type="default"
            stylingMode="contained"
            :width="120"
            @click="saveData"
          />
          <DxButton
            text="Cancel"
            @click="onClose"
            type="normal"
            stylingMode="contained"
            class="bg-gray-300 text-gray-700 hover:bg-gray-400"
            :width="120"
          />
        </div>
        </div>

        
      </form>
    </template>
  </DxPopup>
</template>

<script setup lang="ts">
import DxButton from "devextreme-vue/button";
import DxDateBox from "devextreme-vue/date-box";
import DxFileUploader from "devextreme-vue/file-uploader";
import DxPopup from "devextreme-vue/popup";
import DxSelectBox from "devextreme-vue/select-box";
import DxTextBox from "devextreme-vue/text-box";
import { defineEmits, defineProps, ref, watch } from "vue";

interface FormData {
  id?: number;
  reasonType: number;
  reason: string;
  newStartDate: Date | null;
  newOfficeOpenDate: Date | null;
  newOfficeReEntryDate: Date | null;
  newReturnWorkDate: Date | null;
  notes: string;
}

interface Props {
  visible: boolean;
  type: string;
  initialFormData: Record<string, unknown>;
}

// Define the shape of the payload that will be emitted
interface SavePayload {
  id?: number;
  identification_number: string;
  employee_name: string;
  date_time_get_to_work: string;
  date_time_out_of_office: string;
  date_time_reenter_office: string;
  date_time_back_to_work: string;
  status_presence: string;
  type_noncompliance: string;
}

const emits = defineEmits<{
  close: [];
  save: [payload: SavePayload];
}>();

const props = defineProps<Props>();

const getEmptyForm = (): FormData => ({
  reasonType: 1,
  reason: "",
  newStartDate: null,
  newOfficeOpenDate: null,
  newOfficeReEntryDate: null,
  newReturnWorkDate: null,
  notes: "",
});

const form = ref<FormData>(getEmptyForm());

// Watch for changes in initialFormData (for edit mode)
watch(
  () => props.initialFormData,
  (newVal) => {
    if (props.type === "edit" && newVal && Object.keys(newVal).length > 0) {
      form.value = { ...getEmptyForm(), ...newVal };
    }
  },
  { immediate: true, deep: true }
);

// Watch for changes in type (add/edit)
watch(
  () => props.type,
  (newVal) => {
    if (newVal === "add") {
      form.value = getEmptyForm();
    }
  }
);

// Watch for modal visibility
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      // Reset form when modal is closed
      form.value = getEmptyForm();
    }
  }
);

const reasonTypes = ref([
  { id: 1, text: "Vacation" },
  { id: 2, text: "Sick Leave" },
  { id: 3, text: "Personal Leave" },
  { id: 4, text: "Business Trip" },
]);

const onClose = () => {
  form.value = getEmptyForm();
  emits("close");
};

const saveData = () => {
  // Validate required fields
  if (!form.value.reason || !form.value.notes) {
    alert("Please fill in all required fields");
    return;
  }

  // Set current date/time if dates are null
  const now = new Date();
  const status = isLate(form.value.newStartDate || now) ? "Late" : "Present";
  const noncompliance = determineNoncompliance(
    form.value.reasonType,
    form.value.newStartDate || now
  );

  emits("save", {
    id: typeof props.initialFormData?.id === "number" ? props.initialFormData.id : undefined,
    identification_number: form.value.notes,
    employee_name: form.value.reason,
    date_time_get_to_work: formatDate(form.value.newStartDate || now),
    date_time_out_of_office: formatDate(form.value.newOfficeOpenDate || now),
    date_time_reenter_office: formatDate(form.value.newOfficeReEntryDate || now),
    date_time_back_to_work: formatDate(form.value.newReturnWorkDate || now),
    status_presence: status,
    type_noncompliance: noncompliance,
  });
};

function formatDate(date: Date) {
  return date ? new Date(date).toISOString().slice(0, 16).replace("T", " ") : "";
}

function isLate(startDate: Date) {
  const workStartHour = 8;
  const workStartMinute = 0;
  return (
    startDate.getHours() > workStartHour ||
    (startDate.getHours() === workStartHour && startDate.getMinutes() > workStartMinute)
  );
}

function determineNoncompliance(reasonType: number, startDate: Date) {
  if (isLate(startDate)) {
    return "Late Arrival";
  }

  switch (reasonType) {
    case 1:
      return "Vacation";
    case 2:
      return "Sick Leave";
    case 3:
      return "Personal Leave";
    case 4:
      return "Business Trip";
    default:
      return "None";
  }
}
</script>

<style scoped>
.attendance-modal :deep(.dx-popup-content) {
  padding: 30px;
  background-color: #f9fafb; /* Neutral off-white background for the content area */
}

.attendance-modal :deep(.dx-popup-title) {
  padding: 16px 24px; /* Comfortable padding around the title */
  background-color: #007bff; /* A vibrant blue shade for the title bar */
  color: #ffffff; /* White text for maximum contrast */
  font-size: 18px; /* Slightly larger font size for title */
  font-weight: bold; /* Bold font weight for title */
  border-bottom: 1px solid #006fe6; /* Subtle border for a polished look */
}

.attendance-modal :deep(.dx-texteditor) {
  background-color: #ffffff; /* Keeping input fields bright for readability */
  border: 1px solid #ced4da; /* Standard gray border for inputs */
  border-radius: 0.5rem; /* Fully rounded borders for a modern look */
}

.attendance-modal :deep(.dx-button) {
  background-color: #28a745; /* Green background for primary actions */
  color: #ffffff; /* Ensuring text is easily readable */
  border-radius: 0.5rem; /* Consistent rounded corners for all buttons */
  padding: 12px 20px; /* More padding for button text */
  font-weight: 500; /* Slightly bolder text */
  transition: all 0.2s ease; /* Smooth transition for hover effects */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.attendance-modal :deep(.dx-button):hover {
  background-color: #218838; /* Slightly darker green on hover for feedback */
  transform: translateY(-2px); /* Slight lift effect on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
}

.attendance-modal :deep(.dx-button):active {
  background-color: #1e7e34; /* Even darker for active state */
  transform: translateY(0); /* Reset the transform when clicked */
}

.attendance-modal :deep(.dx-fileuploader-input-wrapper) {
  background-color: #e9ecef; /* Light gray background to differentiate section */
  border: 1px dashed #adb5bd; /* Dashed border for a subtle stylistic touch */
  border-radius: 0.5rem; /* Rounded corners to match other inputs */
  padding: 12px; /* Comfortable padding within the uploader area */
}

.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns layout for form fields */
  column-gap: 20px; /* Spacing between columns */
  row-gap: 16px; /* Spacing between rows */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Vertical spacing between labels and inputs */
}

.col-span-2 {
  grid-column: span 2; /* Ensure some elements span across both columns */
}

.action-buttons {
  display: flex;
  justify-content: center; /* Center action buttons */
  gap: 15px; /* Increased space between buttons */
  padding-top: 30px; /* Extra space above the buttons */
  padding-bottom: 30px; /* Extra space below the buttons */
}
</style>
