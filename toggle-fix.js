// Toggle Auto-Pay Button
function toggleAutoPay() {
    const btn = document.getElementById('autoPayBtn');
    AppState.autoPay = !AppState.autoPay;
    localStorage.setItem('cassette_autoPay', AppState.autoPay);

    // Update button appearance
    if (AppState.autoPay) {
        btn.classList.add('active');
        btn.querySelector('.auto-pay-text').textContent = 'Auto-Pay: ON';
    } else {
        btn.classList.remove('active');
        btn.querySelector('.auto-pay-text').textContent = 'Auto-Pay: OFF';
    }

    console.log(`Auto-Pay ${AppState.autoPay ? 'enabled' : 'disabled'}`);
}
