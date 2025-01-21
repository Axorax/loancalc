const ctx = document.getElementById('doughnut').getContext('2d');

// Gradients for the chart
const gradientPrimary = ctx.createLinearGradient(0, 0, 0, 400);
gradientPrimary.addColorStop(0, '#0093E9');
gradientPrimary.addColorStop(1, '#80D0C7');

const gradientSecondary = ctx.createLinearGradient(0, 0, 0, 400);
gradientSecondary.addColorStop(0, '#FBAB7E');
gradientSecondary.addColorStop(1, '#F7CE68');

// Doughnut chart setup
const doughnutChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Waiting for input!', 'Waiting for input!'],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: [gradientPrimary, gradientSecondary],
        hoverBorderColor: ['transparent'],
        hoverBorderWidth: 0,
        borderWidth: 5,
      },
    ],
  },
  options: {
    rotation: 160,
    responsive: true,
    cutout: '75%',
    animation: {
      animateRotate: true,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        caretSize: 8,
        displayColors: false,
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw}`;
          },
        },
      },
    },
  },
});

// DOM elements for inputs, ranges, and labels
const elements = {
  inputs: {
    principal: document.getElementById('money'),
    interestRate: document.getElementById('interest'),
    months: document.getElementById('months'),
  },
  labels: {
    principal: document.getElementById('money-label'),
    interestRate: document.getElementById('interest-label'),
    months: document.getElementById('months-label'),
  },
  ranges: {
    principal: document.getElementById('money-range'),
    interestRate: document.getElementById('interest-range'),
    months: document.getElementById('months-range'),
  },
  result: {
    totalAmount: document.getElementById('total'),
    principalAmountLabel: document.getElementById('principalLabel'),
    interestAmountLabel: document.getElementById('interestLabel'),
    monthlyPaymentLabel: document.getElementById('perMonth'),
  },
};

// Set up event listeners for range inputs and text inputs
Object.keys(elements.ranges).forEach((key) => {
  elements.ranges[key].addEventListener('input', function () {
    elements.inputs[key].value = elements.ranges[key].value;
    elements.labels[key].classList.add('active');
    debounceUpdateValues();
  });
});

Object.keys(elements.inputs).forEach((key) => {
  elements.inputs[key].addEventListener('input', function () {
    elements.ranges[key].value = elements.inputs[key].value;
    elements.labels[key].classList.add('active');
    debounceUpdateValues();
  });
});

// Function to handle number input and sanitize value
function sanitizeInput(inputElement) {
  inputElement.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9.]/g, '');
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.replace(/\.(?=.*\.)/, '');
    }
    debounceUpdateValues();
  });
}

// Set up input sanitization for all inputs
Object.keys(elements.inputs).forEach((key) => {
  sanitizeInput(elements.inputs[key]);
});

let debounceTimeout;

// Debounce function for input events
function debounceUpdateValues() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    updateValues();
  }, 1000);
}

// Function to calculate and update values
function updateValues() {
  const principal = parseFloat(elements.inputs.principal.value); // Principal amount
  const interestRate = parseFloat(elements.inputs.interestRate.value); // Interest rate
  const months = parseInt(elements.inputs.months.value); // Number of months

  if (principal && interestRate && months) {
    const interestAmount = (principal * interestRate) / 100;
    const totalAmount = principal + interestAmount;
    const monthlyPayment = totalAmount / months;

    // Update the labels with calculated values
    elements.result.principalAmountLabel.innerText = '$' + principal;
    elements.result.monthlyPaymentLabel.innerText = '$' + monthlyPayment.toFixed(2);
    elements.result.interestAmountLabel.innerText = '$' + interestAmount;
    elements.result.totalAmount.innerText = '$' + totalAmount;

    // Update the chart data
    doughnutChart.data.labels = ['Total payment', 'Interest'];
    doughnutChart.data.datasets[0].data = [principal, interestAmount];
    doughnutChart.update();
  }
}
