import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Heart } from "lucide-react-native";
import DiamondCard from "../components/DiamondCard";
import { Diamond } from "../types";
import { api } from "../services/api";

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
      <View style={styles.header}>
        <Text style={styles.title}>Saved Diamonds</Text>
        <Text style={styles.countText}>{diamonds.length} in Wishlist</Text>
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
