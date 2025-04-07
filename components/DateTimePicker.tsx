import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { colors } from '@/constants/colors';
import { Calendar, Clock } from 'lucide-react-native';
import { formatDate, formatTime } from '@/utils/date-utils';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ 
  value, 
  onChange,
  label = 'Data e Hora'
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(value));
  
  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    
    return dates;
  };
  
  // Generate times from 8:00 AM to 8:00 PM in 30-minute intervals
  const generateTimes = () => {
    const times = [];
    const baseDate = new Date(tempDate);
    baseDate.setHours(8, 0, 0, 0); // Start at 8:00 AM
    
    for (let i = 0; i < 25; i++) { // 12 hours * 2 (30-min intervals) + 1
      const time = new Date(baseDate);
      time.setMinutes(baseDate.getMinutes() + (i * 30));
      times.push(time);
    }
    
    return times;
  };
  
  const handleDateSelect = (date: Date) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setTempDate(newDate);
    setShowDatePicker(false);
    setShowTimePicker(true);
  };
  
  const handleTimeSelect = (time: Date) => {
    const newDate = new Date(tempDate);
    newDate.setHours(time.getHours(), time.getMinutes());
    setTempDate(newDate);
    onChange(newDate);
    setShowTimePicker(false);
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  const isSameTime = (date1: Date, date2: Date) => {
    return (
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Calendar size={18} color={colors.textLight} />
            <Text style={styles.dateText}>{formatDate(value.getTime())}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Clock size={18} color={colors.textLight} />
            <Text style={styles.timeText}>{formatTime(value.getTime())}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Data</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dateList}>
              {generateDates().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    isSameDate(date, tempDate) && styles.selectedDateItem,
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text 
                    style={[
                      styles.dateItemText,
                      isToday(date) && styles.todayText,
                      isSameDate(date, tempDate) && styles.selectedDateText,
                    ]}
                  >
                    {formatDate(date.getTime())}
                    {isToday(date) && " (Hoje)"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Hora</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.timeList}>
              {generateTimes().map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeItem,
                    isSameTime(time, tempDate) && styles.selectedTimeItem,
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text 
                    style={[
                      styles.timeItemText,
                      isSameTime(time, tempDate) && styles.selectedTimeText,
                    ]}
                  >
                    {formatTime(time.getTime())}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.card,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.primary,
  },
  dateList: {
    maxHeight: 400,
  },
  dateItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedDateItem: {
    backgroundColor: `${colors.primary}15`,
  },
  dateItemText: {
    fontSize: 16,
    color: colors.text,
  },
  todayText: {
    fontWeight: '600',
  },
  selectedDateText: {
    color: colors.primary,
    fontWeight: '600',
  },
  timeList: {
    maxHeight: 400,
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTimeItem: {
    backgroundColor: `${colors.primary}15`,
  },
  timeItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedTimeText: {
    color: colors.primary,
    fontWeight: '600',
  },
});