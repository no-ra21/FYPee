/*
 * Contact Form Component JavaScript
 * Handles form validation, submission, and prefilling
 */

class ContactForm {
  constructor(selector = '.contact-form') {
    this.form = document.querySelector(selector);
    if (!this.form) return;
    
    this.fields = {};
    this.validators = {};
    this.isSubmitting = false;
    
    this.init();
  }
  
  init() {
    this.setupFields();
    this.setupValidators();
    this.setupEventListeners();
    this.prefillFromQuery();
  }
  
  setupFields() {
    // Get all form fields
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      this.fields[input.name] = {
        element: input,
        errorElement: this.form.querySelector(`#${input.name}Error`),
        value: '',
        isValid: false,
        touched: false
      };
    });
  }
  
  setupValidators() {
    this.validators = {
      name: (value) => {
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        return null;
      },
      
      email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      },
      
      phone: (value) => {
        if (value) {
          const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/;
          if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number';
          }
        }
        return null;
      },
      
      company: (value) => {
        // Company is optional but if provided, should be reasonable length
        if (value && value.trim().length > 100) {
          return 'Company name is too long';
        }
        return null;
      },
      
      product: (value) => {
        // Product selection is optional
        return null;
      },
      
      message: (value) => {
        if (!value || value.trim().length < 10) {
          return 'Message must be at least 10 characters long';
        }
        if (value.trim().length > 1000) {
          return 'Message is too long (maximum 1000 characters)';
        }
        return null;
      }
    };
  }
  
  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Field validation on blur and input
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      
      field.element.addEventListener('blur', () => {
        field.touched = true;
        this.validateField(fieldName);
      });
      
      field.element.addEventListener('input', () => {
        if (field.touched) {
          this.validateField(fieldName);
        }
        this.updateSubmitButton();
      });
    });
  }
  
  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;
    
    const value = field.element.value.trim();
    const validator = this.validators[fieldName];
    
    let error = null;
    if (validator) {
      error = validator(value);
    }
    
    field.isValid = !error;
    field.value = value;
    
    // Update UI
    this.updateFieldUI(fieldName, error);
    
    return field.isValid;
  }
  
  updateFieldUI(fieldName, error) {
    const field = this.fields[fieldName];
    const formGroup = field.element.closest('.form-group');
    
    // Remove existing classes
    formGroup?.classList.remove('has-error', 'has-success');
    
    if (field.touched) {
      if (error) {
        formGroup?.classList.add('has-error');
        if (field.errorElement) {
          field.errorElement.textContent = error;
          field.errorElement.style.display = 'block';
        }
      } else if (field.value) {
        formGroup?.classList.add('has-success');
        if (field.errorElement) {
          field.errorElement.style.display = 'none';
        }
      }
    }
  }
  
  updateSubmitButton() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    const allValid = Object.keys(this.fields).every(fieldName => {
      const field = this.fields[fieldName];
      const isRequired = field.element.hasAttribute('required');
      return !isRequired || field.isValid;
    });
    
    submitButton.disabled = !allValid || this.isSubmitting;
  }
  
  async handleSubmit() {
    if (this.isSubmitting) return;
    
    // Validate all fields
    let allValid = true;
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      field.touched = true;
      if (!this.validateField(fieldName)) {
        allValid = false;
      }
    });
    
    if (!allValid) {
      this.showMessage('Please fix the errors below.', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.updateSubmitButton();
    this.showLoadingState();
    
    try {
      // Collect form data
      const formData = {};
      Object.keys(this.fields).forEach(fieldName => {
        formData[fieldName] = this.fields[fieldName].value;
      });
      
      // Submit the form
      const result = await this.submitForm(formData);
      
      if (result.success) {
        this.showMessage('Thank you! Your message has been sent successfully.', 'success');
        this.resetForm();
      } else {
        this.showMessage(result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('Something went wrong. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton();
      this.hideLoadingState();
    }
  }
  
  async submitForm(formData) {
    try {
      const response = await fetch('https://formspree.io/f/mvzzozne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        return { success: true, message: 'Email sent successfully' };
      } else {
        return { success: false, message: 'Failed to send email. Please try again.' };
      }
    } catch (error) {
      console.error('Form submission error:', error);
      return { success: false, message: 'Failed to send email. Please try again.' };
    }
  }
  
  showMessage(message, type = 'info') {
    let messageElement = this.form.querySelector('.form-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      this.form.insertBefore(messageElement, this.form.firstChild);
    }
    
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  }
  
  showLoadingState() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.classList.add('loading');
    }
  }
  
  hideLoadingState() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.classList.remove('loading');
    }
  }
  
  resetForm() {
    this.form.reset();
    
    // Reset field states
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      field.value = '';
      field.isValid = false;
      field.touched = false;
      
      const formGroup = field.element.closest('.form-group');
      formGroup?.classList.remove('has-error', 'has-success');
      
      if (field.errorElement) {
        field.errorElement.style.display = 'none';
      }
    });
    
    this.updateSubmitButton();
  }
  
  prefillFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    
    if (product && this.fields.product) {
      this.fields.product.element.value = product;
      this.validateField('product');
    }
  }
}

// Export for use in main.js
window.ContactForm = ContactForm;
