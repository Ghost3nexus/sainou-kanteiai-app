import { Document, Page, Text, StyleSheet, Font, View } from '@react-pdf/renderer';

// 日本語フォントの登録
Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.otf'
});

// スタイルの定義
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'NotoSansJP'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a365d'
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2c5282',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#718096',
    fontSize: 10
  }
});

interface PDFReportProps {
  content: string;
}

export function PDFReport({ content }: PDFReportProps) {
  // 現在の日付を取得
  const date = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // コンテンツを段落に分割
  const paragraphs = content.split('\n').filter(p => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>才能鑑定レポート</Text>
        
        <Text style={{ fontSize: 12, marginBottom: 20, textAlign: 'right' }}>
          作成日: {date}
        </Text>

        {paragraphs.map((paragraph, index) => {
          // 数字で始まる行を見出しとして扱う
          const isHeading = /^\d+\./.test(paragraph);
          
          return (
            <Text
              key={index}
              style={isHeading ? styles.subHeader : styles.paragraph}
            >
              {paragraph}
            </Text>
          );
        })}

        <Text style={styles.footer}>
          © {new Date().getFullYear()} 才能鑑定AI - すべての権利を保有
        </Text>
      </Page>
    </Document>
  );
}