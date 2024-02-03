<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md">
        <q-card class="q-ma-auto" style="max-width: 400px">
          <q-card-section>
            <q-form @submit.prevent="submitForm">
              <q-select
                v-model="selectedWeek"
                :options="weekOptions"
                label="בחר שבוע"
                @input="updateSelectedWeek"
                emit-value
                map-options
                option-label="label"
                option-value="value"
              ></q-select>
              <q-select
                v-model="selectedLesson"
                :options="lessonOptions"
                label="בחר שיעור"
                class="q-mt-md"
                @input="updateSelectedLesson"
                emit-value
                map-options
                option-label="label"
                option-value="value"
              ></q-select>
              <q-file
                filled
                bottom-slots
                v-model="file"
                label="בחר קובץ"
                accept=".ppt, .pptx"
                class="q-mt-md"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-cloud-upload-alt" @click.stop.prevent />
                </template>
                <template v-slot:append v-if="file != null">
                  <q-icon
                    name="fas fa-times"
                    @click.stop.prevent="file = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>

              <q-btn
                type="submit"
                label="העלאה"
                color="primary"
                class="q-mt-md"
                :disable="!isFormValid"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      weeksWithDetails: [],
      selectedWeek: null,
      file: null,
      isLoad: false,
      selectedLesson: null,
    };
  },
  methods: {
    updateSelectedWeek(value) {
      this.selectedWeek = value;
      this.checkFormValidity();
    },
    updateSelectedLesson(value) {
      this.selectedLesson = value;
      this.checkFormValidity();
    },
    updateSelectedFile(event) {
      this.file = event.target.files[0];
      this.checkFormValidity();
    },

    checkFormValidity() {
      // Check if all required fields are filled
      this.isFormValid =
        !!this.selectedWeek && !!this.selectedLesson && !!this.file;
    },

    async submitForm() {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("lesson", this.selectedLesson);
        formData.append("file", this.file);
        console.log(formData);
        // Send the file upload request using axios
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData
        );

        // Handle the response, e.g., update your lessons array in Vuex or locally
        console.log("File uploaded successfully:", response.data);

        // Optionally, reset the form values
        this.file = null;
      } catch (error) {
        // Handle errors, e.g., display an error message to the user
        console.error("Error uploading file:", error);
      }
    },

    async fetchWeeksWithDetails() {
      try {
        const response = await axios.get("http://localhost:3000/api/weeks");
        this.weeksWithDetails = response.data;
        console.log(this.weeksWithDetails);
        this.isLoad = true;
      } catch (error) {
        console.error("Error fetching weeks with details:", error);
      }
    },
  },

  async beforeMount() {
    this.fetchWeeksWithDetails();
  },

  computed: {
    weekOptions() {
      return this.weeksWithDetails.map((week) => ({
        label: `שבוע ${week.weekNumber}`,
        value: week.id,
      }));
    },
    lessonOptions() {
      const selectedWeekObj = this.weeksWithDetails.find(
        (week) => week.id === this.selectedWeek
      );
      if (selectedWeekObj) {
        return selectedWeekObj.lessons.map((lesson) => ({
          label: lesson.title,
          value: lesson.id,
        }));
      } else {
        return [];
      }
    },
    isFormValid: {
      // Computed property to determine if the form is valid
      get() {
        return !!this.selectedWeek && !!this.selectedLesson && !!this.file;
      },
    },
  },
};
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}

.q-ma-auto {
  margin: auto;
}

.q-mt-md {
  margin-top: 20px;
}
</style>
