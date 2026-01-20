import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#2b8aef',
  background: '#ffffff',
  textMuted: '#666',
  border: '#e6e6e6'
};

export default StyleSheet.create({
  page: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
