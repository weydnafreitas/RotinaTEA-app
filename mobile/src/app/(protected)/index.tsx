import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { Colors, Spacing, Typography, BorderRadius } from "@/constants/Theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import api from "@/services/api";
import { Child } from "@/types/child";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  useEffect(() => {
    loadChildren();
  }, []);

  const handleEditDependents = () => {
    router.push("/editDependents");
  };

  const loadChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get("/child");
      setChildren(response.data);
    } catch (error) {
      console.error("Erro ao carregar filhos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = () => {
    router.push("/addChild");
  };

  const nextChild = () => {
    if (selectedChildIndex < children.length - 1) {
      setSelectedChildIndex(selectedChildIndex + 1);
    }
  };

  const previousChild = () => {
    if (selectedChildIndex > 0) {
      setSelectedChildIndex(selectedChildIndex - 1);
    }
  };

  const getAge = (birthDate: string) => {
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
    return age;
  };

  const selectedChild = children[selectedChildIndex];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header com perfil do usuário */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <MaterialIcons
                  name="person"
                  size={32}
                  color={Colors.light.text}
                />
              )}
            </View>
            <View>
              <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
              <Text style={styles.userLink}>Meu perfil</Text>
            </View>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Seção Meus Perfis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meus perfis</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
          ) : children.length > 0 ? (
            <>
              {/* Carrossel de perfis */}
              <View style={styles.profileCarousel}>
                {children.length > 1 && (
                  <TouchableOpacity
                    onPress={previousChild}
                    disabled={selectedChildIndex === 0}
                    style={[
                      styles.carouselButton,
                      selectedChildIndex === 0 && styles.carouselButtonDisabled,
                    ]}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={24}
                      color={
                        selectedChildIndex === 0
                          ? Colors.light.border
                          : Colors.light.text
                      }
                    />
                  </TouchableOpacity>
                )}

                <View style={styles.profileCard}>
                  <View style={styles.childAvatar}>
                    {selectedChild?.avatarUrl ? (
                      <Image
                        source={{ uri: selectedChild.avatarUrl }}
                        style={styles.childAvatarImage}
                      />
                    ) : (
                      <MaterialIcons
                        name="person"
                        size={40}
                        color={Colors.light.text}
                      />
                    )}
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{selectedChild?.name}</Text>
                    <Text style={styles.childAge}>
                      {getAge(selectedChild?.birthDate)} anos
                    </Text>
                    <Text style={styles.childDetails}>
                      Tea, Nível {selectedChild?.supportLevel}
                    </Text>
                  </View>
                </View>

                {children.length > 1 && (
                  <TouchableOpacity
                    onPress={nextChild}
                    disabled={selectedChildIndex === children.length - 1}
                    style={[
                      styles.carouselButton,
                      selectedChildIndex === children.length - 1 &&
                        styles.carouselButtonDisabled,
                    ]}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={
                        selectedChildIndex === children.length - 1
                          ? Colors.light.border
                          : Colors.light.text
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Indicadores de página */}
              {children.length > 1 && (
                <View style={styles.pageIndicators}>
                  {children.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === selectedChildIndex && styles.indicatorActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum dependente cadastrado</Text>
            </View>
          )}

          {/* Botão Cadastrar Atividade */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/createTask")}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color={Colors.light.primary}
            />
            <Text style={styles.addButtonText}>Criar nova tarefa</Text>
          </TouchableOpacity>

          {/* Botão Editar Dependentes */}
          <TouchableOpacity style={styles.addButton} onPress={handleEditDependents}>
            <MaterialIcons
              name="edit"
              size={24}
              color={Colors.light.primary}
            />
            <Text style={styles.addButtonText}>Editar dependentes</Text>
          </TouchableOpacity>

          {/* Botão Adicionar Novo Filho */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
            <MaterialIcons
              name="add-circle"
              size={24}
              color={Colors.light.primary}
            />
            <Text style={styles.addButtonText}>Adicionar novo filho</Text>
          </TouchableOpacity>
        </View>

        {/* Próximas Atividades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas atividades</Text>
            <TouchableOpacity>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View
              style={[styles.activityBar, { backgroundColor: "#5B8DEE" }]}
            />
            <View style={styles.activityIcon}>
              <MaterialIcons name="psychology" size={24} color="#5B8DEE" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Psicólogo</Text>
              <Text style={styles.activityDuration}>60 min</Text>
            </View>
            <Text style={styles.activityTime}>09:20</Text>
          </View>

          <View style={styles.activityCard}>
            <View
              style={[styles.activityBar, { backgroundColor: "#E89B4F" }]}
            />
            <View style={styles.activityIcon}>
              <MaterialIcons name="restaurant" size={24} color="#E89B4F" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Almoçar</Text>
              <Text style={styles.activityDuration}>20 min</Text>
            </View>
            <Text style={styles.activityTime}>12:00</Text>
          </View>

          <View style={styles.activityCard}>
            <View
              style={[styles.activityBar, { backgroundColor: "#5B8DEE" }]}
            />
            <View style={styles.activityIcon}>
              <MaterialIcons name="school" size={24} color="#5B8DEE" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Escola</Text>
              <Text style={styles.activityDuration}>120 min</Text>
            </View>
            <Text style={styles.activityTime}>13:00</Text>
          </View>
        </View>

        {/* Conexões */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conexões</Text>
            <TouchableOpacity>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.connectionCard}>
            <View style={styles.connectionAvatar}>
              <MaterialIcons
                name="person"
                size={32}
                color={Colors.light.text}
              />
            </View>
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionName}>Marcia Freitas</Text>
              <Text style={styles.connectionDetails}>
                EEEP Francisco das chagas
              </Text>
              <Text style={styles.connectionRole}>(Professora)</Text>
            </View>
          </View>

          <View style={styles.connectionCard}>
            <View style={styles.connectionAvatar}>
              <MaterialIcons
                name="person"
                size={32}
                color={Colors.light.text}
              />
            </View>
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionName}>Bruno Gomes</Text>
              <Text style={styles.connectionDetails}>
                Clínica Janaína Queiroz
              </Text>
              <Text style={styles.connectionRole}>(Psicólogo)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={Colors.light.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5
            name="user-friends"
            size={20}
            color={Colors.light.textSecondary}
          />
          <Text style={styles.navText}>Perfis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons
            name="settings"
            size={24}
            color={Colors.light.textSecondary}
          />
          <Text style={styles.navText}>Ajustes</Text>
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
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.text,
  },
  userLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  logoutButton: {
    padding: Spacing.sm,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: Spacing.md,
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.text,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  profileCarousel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.md,
  },
  carouselButton: {
    padding: Spacing.sm,
  },
  carouselButtonDisabled: {
    opacity: 0.3,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  childAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  childAvatarImage: {
    width: "100%",
    height: "100%",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.text,
  },
  childAge: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  childDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  pageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },
  indicatorActive: {
    backgroundColor: Colors.light.primary,
    width: 24,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.light.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.primary,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityBar: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  activityInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activityTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text,
  },
  activityDuration: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.light.text,
  },
  connectionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  connectionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.light.text,
  },
  connectionDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  connectionRole: {
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
  },
  navTextActive: {
    color: Colors.light.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
