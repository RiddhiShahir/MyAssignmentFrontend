import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemesContext';

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any; // the outer style you pass (e.g. backgroundColor)
  iconColor?: string; // optional – will fall back to theme.text
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChangeText,
  style,
  iconColor,
}) => {
  const [secureText, setSecureText] = useState(true);
  const {theme} = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureText}
        style={styles.input}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setSecureText(!secureText)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon
          name={secureText ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color={iconColor || '#666'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',        // ensures text stays vertically centered
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 48,                  // fixed height matching other fields
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,          // critical: removes extra internal padding
    textAlignVertical: 'center', // ensures text stays centered vertically
  },
  iconContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PasswordInput;
