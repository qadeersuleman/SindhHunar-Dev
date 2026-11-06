import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showCart?: boolean;
  onCartPress?: () => void;
  cartItemCount?: number;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  showCart = false,
  onCartPress,
  cartItemCount = 0,
  showMenu = false,
  onMenuPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {title && (
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      
      <View style={styles.right}>
        {showCart && (
          <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  cartIcon: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#C41E3A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Header;
