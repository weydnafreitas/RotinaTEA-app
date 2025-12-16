import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/Theme";

export default function CreateTask() {
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState("");

  const [endType, setEndType] = useState<"never" | "on" | "after">("never");
  const [notes, setNotes] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const toggleDay = (dayIndex: number) => {
  setSelectedDays((prev) =>
    prev.includes(dayIndex)
      ? prev.filter((d) => d !== dayIndex)
      : [...prev, dayIndex]
  );
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Crie uma nova tarefa</Text>

        {/* Título */}
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escola"
          value={title}
          onChangeText={setTitle}
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => {
              setCategory(value);
              setShowCustomCategory(value === "custom");
            }}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            <Picker.Item label="Ensino" value="ensino" />
            <Picker.Item label="Alimentação" value="alimentacao" />
            <Picker.Item label="Saúde" value="saude" />
            <Picker.Item label="Higiene" value="higiene" />
            <Picker.Item label="Adicionar nova categoria" value="custom" />
          </Picker>
        </View>

        {showCustomCategory && (
          <TextInput
            style={styles.input}
            placeholder="Digite o nome da nova categoria"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
        )}

        {/* Data */}
        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity
            style={styles.select}
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={styles.selectText}>
                {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR")
                : "Selecionar data"}
            </Text>
            <MaterialIcons name="calendar-today" size={18} />
            </TouchableOpacity>

            {showDatePicker && (
            <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
                }}
            />
            )}

        {/* Recorrência */}
        <Text style={styles.label}>Recorrência:</Text>
        <View style={styles.select}>
          <Picker
            selectedValue={recurrence}
            onValueChange={setRecurrence}
          >
            <Picker.Item label="Selecione a recorrência" value="" />
            <Picker.Item label="Sempre" value="always" />
            <Picker.Item label="Dias de semana" value="weekdays" />
            <Picker.Item label="Finais de semana" value="weekends" />
            <Picker.Item label="Personalizado" value="custom" />
          </Picker>
        </View>

        {/* Dias da semana (exibido se personalizado) */}
        {recurrence === "custom" && (
        <View style={styles.weekRow}>
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => {
            const isSelected = selectedDays.includes(index);

            return (
                <TouchableOpacity
                key={index}
                onPress={() => toggleDay(index)}
                style={[
                    styles.weekDay,
                    !isSelected && styles.weekDayInactive,
                ]}
                >
                <Text
                    style={[
                    styles.weekDayText,
                    !isSelected && styles.weekDayTextInactive,
                    ]}
                >
                    {day}
                </Text>
                </TouchableOpacity>
            );
            })}
        </View>
        )}

        {/* Termina em */}
        <Text style={styles.label}>Termina em:</Text>

        <TouchableOpacity
          style={styles.radio}
          onPress={() => setEndType("never")}
        >
          <View
            style={[
              styles.radioCircle,
              endType === "never" && styles.radioActive,
            ]}
          />
          <Text>Nunca</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.radio}
        onPress={() => {
         setEndType("on");
         setShowEndDatePicker(true);
        }}
        >

          <View
            style={[
              styles.radioCircle,
              endType === "on" && styles.radioActive,
            ]}
          />
          <Text>Em</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radio}
          onPress={() => setEndType("after")}
        >
          <View
            style={[
              styles.radioCircle,
              endType === "after" && styles.radioActive,
            ]}
          />
          <Text>Após</Text>
        </TouchableOpacity>

        {(endType === "on" || endType === "after") && (
        <TouchableOpacity
            style={styles.select}
            onPress={() => setShowEndDatePicker(true)}
        >
            <Text style={styles.selectText}>
            {endDate
                ? endDate.toLocaleDateString("pt-BR")
                : "Selecionar data final"}
            </Text>
            <MaterialIcons name="calendar-today" size={18} />
        </TouchableOpacity>
        )}

        {showEndDatePicker && Platform.OS !== "web" && (
            <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(_, date) => {
                setShowEndDatePicker(false);
                if (date) setEndDate(date);
                }}
            />
            )}


        {/* Observações */}
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Informe algo..."
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {/* Botões */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createText}>Criar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  pageTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  label: {
    marginTop: Spacing.md,
    marginBottom: 4,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  select: {
    backgroundColor: "#fff",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.sm,
  },
  selectText: {
    color: Colors.light.textSecondary,
  },
  weekRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  weekDay: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginVertical: 4,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  radioActive: {
    backgroundColor: Colors.light.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xl,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  cancelText: {
    color: Colors.light.primary,
  },
  createButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  createText: {
    color: "#fff",
    fontWeight: "bold",
  },
  weekDayInactive: {
  backgroundColor: "#E0E0E0",
  },
  weekDayTextInactive: {
  color: "#555",
  },
});
