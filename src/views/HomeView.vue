<template>
  <div class="container-cards">
    <div class="flex-cards">
     <div style="margin-bottom: 10%;" v-for="week in weeksWithDetails" :key="week.id">
      <div style="text-align: right;">Week {{ week.weekNumber }}</div>
      <div class="lessons-container">
        <div v-for="lesson in week.lessons" :key="lesson.id" class="lesson-card">
          <div class="text" @click="openModal(lesson)">{{ lesson.title }}</div>
          <div v-if="lesson.showModal" class="modal">
            <button v-for="practice in lesson.practices" :key="practice.id" @click="navigateToPractice(practice)">
              {{ practice.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      weeksWithDetails: [],
    };
  },
  mounted() {
    this.fetchWeeksWithDetails();
  },
  methods: {
    async fetchWeeksWithDetails() {
      try {
        const response = await axios.get('http://localhost:3000/api/weeks');
        this.weeksWithDetails = response.data;
        console.log(this.weeksWithDetails)
      } catch (error) {
        console.error('Error fetching weeks with details:', error);
      }
    },
    openModal(lesson) {
      // Close all other modals
      this.weeksWithDetails.forEach(week => {
        week.lessons.forEach(lesson => {
          lesson.showModal = false;
        });
      });
      // Open the modal for the clicked lesson
      lesson.showModal = true;
    },
    navigateToPractice(practice) {
      // Use Vue Router to navigate to the specific practice route
      this.$router.push(`/practice/${practice.id}`);
    },
  },
};
</script>

<style>
.container-cards{
 margin-top: 100px;
 width: 1200px;
 margin-left: auto;
 margin-right: auto;
}
.flex-cards{
  width: 100%;
     position: relative;
    display: flex;
    flex-wrap: wrap;
     justify-content: center;
     flex-direction: column;
}
.text{
  font-size: 18px;
  font-weight: 600;
   height: 100%;
  cursor: pointer;
      display: flex;
    align-items: center;

}
 
h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

h3 {
  font-size: 1.2em;
  margin-bottom: 5px;
  cursor: pointer;
}

.lessons-container {
  display: flex;
  justify-content: center;
}

.lesson-card {
       border: 1px solid #ddd;
    padding: 0.5em;
    margin: 10px;
    height: 50px;

 }

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
