import { describe, it, expect } from 'vitest';
import {
  validateAllTranslations,
  validateComponentTranslations,
  formatValidationErrors,
} from '@/lib/i18n/validate-translations';

// These tests need Node environment to access filesystem
describe('Translation Validation', () => {
  it('should validate that all component translations have matching keys', {
    environment: 'node',
  }, () => {
    const result = validateAllTranslations();
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should validate Header component translations specifically', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('Header');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate LandingPage component translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('LandingPage');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate Dashboard component translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('Dashboard');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate Login component translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('Login');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate Pricing component translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('Pricing');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate LanguageSwitcher component translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('LanguageSwitcher');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
  
  it('should validate shared translations', {
    environment: 'node',
  }, () => {
    const result = validateComponentTranslations('shared');
    
    if (!result.isValid) {
      console.error('\n' + formatValidationErrors(result));
    }
    
    expect(result.isValid).toBe(true);
  });
});

