import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Heart, User as UserIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DiamondCard from "../components/DiamondCard";
import { Diamond } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Props {
  navigation: any;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export default function WishlistScreen({
  navigation,
  wishlist,
  onToggleWishlist,
}: Props) {
  const insets = useSafeAreaInsets();
  const { currentUser, openAuthModal } = useAuth();
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.getDiamonds();
        setDiamonds(all.filter((d) => wishlist.includes(d.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [wishlist]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <View>
          <Text style={styles.title}>Saved Diamonds</Text>
          <Text style={styles.countText}>{diamonds.length} in Wishlist</Text>
        </View>

        {/* User Sign In / Profile Button */}
        <TouchableOpacity
          style={[styles.authHeaderBtn, currentUser ? styles.authHeaderBtnLoggedIn : null]}
          onPress={() => openAuthModal("signin")}
        >
          <UserIcon size={15} color={currentUser ? "#b45309" : "#ffffff"} />
          <Text
            style={[
              styles.authHeaderBtnText,
              currentUser ? styles.authHeaderBtnTextLoggedIn : null,
            ]}
            numberOfLines={1}
          >
            {currentUser ? currentUser.name.split(" ")[0] : "Sign In"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#d97706" />
        </View>
      ) : (
        <FlatList
          data={diamonds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiamondCard
              diamond={item}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onSelect={(d) => navigation.navigate("DiamondDetail", { diamond: d })}
              onInquire={(d) =>
                navigation.navigate("DiamondDetail", { diamond: d })
              }
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Heart size={40} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
              <Text style={styles.emptySub}>
                Browse the diamond vault and tap the heart icon to save stones for review.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  countText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  authHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 10,
    gap: 6,
  },
  authHeaderBtnLoggedIn: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  authHeaderBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  authHeaderBtnTextLoggedIn: {
    color: "#b45309",
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#334155",
    marginTop: 14,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});

