import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from "chart.js";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


interface LineChartProps {
    labels: string[];
    dataPoints: number[];
    labelTitle: string;
    chartTitle: string;
    xTitle: string;
    yTitle: string;
}

const LineChart = ({
    labels,
    dataPoints,
    labelTitle,
    chartTitle,
    xTitle,
    yTitle,
}: LineChartProps) => {

  const data = {
    labels,
    datasets: [
      {
        label: labelTitle,
        data: dataPoints,
        borderColor: "rgba(103, 89, 122, 1)",
        backgroundColor: "rgba(103, 89, 122, 0.2)",
        tension: 1, // For smooth curves
      },
    ],
  };

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: chartTitle ? true : false,
        text: chartTitle,
      },
    },
    scales: {
      x: {
        title: {
          display: xTitle ? true : false,
          text: xTitle,
        },
      },
      y: {
        title: {
          display: yTitle ? true : false,
          text: yTitle,
        },
      },
    },
  };

  return <Line data={data} options={options} style={{
    height: "100%",
    width: "100%",
  }} />;
};

export default LineChart;
