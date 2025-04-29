const allCurrenciesUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

async function getAllCurrencies() {
  try {
    const response = await fetch(allCurrenciesUrl);
    const data = await response.json();
    return Object.keys(data); 
  } catch (error) {
    console.error('Error fetching all currencies:', error);
    return [];
  }
}

async function getCurrencyRates(fromCurrency, toCurrency) {
  const ratesUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;
  try {
    const response = await fetch(ratesUrl);
    const data = await response.json();

    if (data[fromCurrency] && data[fromCurrency][toCurrency]) {
      return data[fromCurrency][toCurrency]; 
    } else {
      console.error(`Rate for ${fromCurrency} to ${toCurrency} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching currency data:', error);
    return null;
  }
}

async function populateCurrencyDropdowns() {
  const currencies = await getAllCurrencies();

  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');

  fromCurrencySelect.innerHTML = '';
  toCurrencySelect.innerHTML = '';

  currencies.forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromCurrencySelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency;
    optionTo.textContent = currency;
    toCurrencySelect.appendChild(optionTo);
  });
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
  const rate = await getCurrencyRates(fromCurrency, toCurrency);
  if (!rate) {
    console.error('Error: Unable to fetch the conversion rate.');
    return;
  }

  const convertedAmount = amount * rate;
  document.getElementById('result').textContent = `Converted Amount: ${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

document.getElementById('convert-btn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  convertCurrency(amount, fromCurrency, toCurrency);
});

document.getElementById('swap-button').addEventListener('click', () => {
  const fromCurrency = document.getElementById('from-currency');
  const toCurrency = document.getElementById('to-currency');

  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

populateCurrencyDropdowns();
