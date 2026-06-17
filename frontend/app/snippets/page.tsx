'use client';

import { useEffect, useState } from 'react';
import { isDebugEnabled, syncFlagFromUrl } from '../lib/devtools';

const astroSnippet = `---
import Layout from '../layouts/Layout.astro';
import BookCount from '../components/BookCount.jsx';

const books = await fetch('https://api.example.com/books').then((r) => r.json());
---

<Layout title="My Shelf">
  <h1>My Shelf</h1>
  <ul>
    {books.map((book) => (
      <li>{book.title}</li>
    ))}
  </ul>
  <BookCount client:load />
</Layout>`;

const expoSnippet = `import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShelfScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('count').then((v) => setCount(Number(v) || 0));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books read: {count}</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Add one</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600' },
  button: { marginTop: 16, padding: 12, backgroundColor: '#3b5bdb', borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
});`;

export default function SnippetsPage() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    syncFlagFromUrl();
    setEnabled(isDebugEnabled());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!enabled) {
    return <div className="center-state">Page not found.</div>;
  }

  return (
    <div>
      <h1>Snippets</h1>
      <p className="subtle">Two short files from other projects.</p>

      <h3>Snippet A</h3>
      <pre className="snippet">{astroSnippet}</pre>

      <h3 style={{ marginTop: 24 }}>Snippet B</h3>
      <pre className="snippet">{expoSnippet}</pre>
    </div>
  );
}
