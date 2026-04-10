import { collection, writeBatch, doc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { mockCFOPs, mockNCMs, mockCSTs, mockArticles } from '../mockData';

export async function seedDatabase() {
  try {
    // Check if already seeded (simple check)
    const cfopSnap = await getDocs(query(collection(db, 'cfops'), limit(1)));
    if (!cfopSnap.empty) {
      return { success: true, message: "Banco de dados já contém dados." };
    }

    const batch = writeBatch(db);

    // Seed CFOPs
    mockCFOPs.forEach(cfop => {
      const ref = doc(collection(db, 'cfops'), cfop.code);
      batch.set(ref, cfop);
    });

    // Seed NCMs
    mockNCMs.forEach(ncm => {
      const ref = doc(collection(db, 'ncms'), ncm.code);
      batch.set(ref, ncm);
    });

    // Seed CSTs
    mockCSTs.forEach(cst => {
      const ref = doc(collection(db, 'cst_csosn'), cst.code);
      batch.set(ref, cst);
    });

    // Seed Articles
    mockArticles.forEach((art, index) => {
      const ref = doc(collection(db, 'knowledge_articles'), `art_${index}`);
      batch.set(ref, art);
    });

    await batch.commit();
    return { success: true, message: "Banco de dados populado com sucesso!" };
  } catch (error) {
    console.error("Seed Error:", error);
    return { success: false, message: "Erro ao popular banco de dados." };
  }
}
