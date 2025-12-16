import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import api from "@/services/api";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/Theme";
import { Child } from "@/types/child";

export default function EditDependents() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get("/child");
      setChildren(response.data);
    } catch (error) {
      console.error("Erro ao carregar dependentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return `${age} anos`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.light.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dependentes</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Editar dados do dependente</Text>
        <Text style={styles.subtitle}>
          Atualize as informações para garantir um acompanhamento adequado.
        </Text>

        {/* Lista de dependentes */}
        <FlatList
          data={children}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>
                Nenhum dependente cadastrado.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <MaterialIcons
                    name="person"
                    size={28}
                    color={Colors.light.textSecondary}
                  />
                )}
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.age}>{getAge(item.birthDate)}</Text>
              </View>

              {/* Menu de ações */}
              <TouchableOpacity>
                <MaterialIcons
                  name="more-vert"
                  size={24}
                  color={Colors.light.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Botão adicionar */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/addChild")}
        >
          <MaterialIcons
            name="add-circle"
            size={24}
            color={Colors.light.primary}
          />
          <Text style={styles.addButtonText}>
            Adicione um novo dependente
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.md,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginVertical: Spacing.xl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text,
  },
  age: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    backgroundColor: "transparent",
  },
  addButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
});
