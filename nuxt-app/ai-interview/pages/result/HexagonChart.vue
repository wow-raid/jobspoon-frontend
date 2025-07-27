<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps<{
  scoreList: { type: string; score: number }[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let radarChart: Chart | null = null;

const drawChart = () => {
  if (!chartCanvas.value || !props.scoreList || !Array.isArray(props.scoreList))
    return;
  if (props.scoreList.length === 0) return;

  const labels = props.scoreList.map((item) => item.type);
  const data = props.scoreList.map((item) => item.score);

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(chartCanvas.value, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "면접 점수",
          data,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 20,
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            color: "#444",
          },
          pointLabels: {
            font: {
              size: 14,
            },
            color: "#222",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};

watch(() => props.scoreList, drawChart);
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  max-width: 350px; /* 작게 만들기 */
  height: 250px;
  margin: auto;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
