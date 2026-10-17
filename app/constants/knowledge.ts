// constants/knowledge.ts

export interface GradeTextbook {
  grade: string;
  subjects: string[];
  url: string;
}

export interface KnowledgeBaseStructure {
  program: {
    folderName: string;
    files: string[];
  };
  criteria: {
    folderName: string;
    files: string[];
  };
  textbooks: {
    fileName: string;
    links: GradeTextbook[];
  };
}

export const PISA_KNOWLEDGE_BASE: KnowledgeBaseStructure = {
  program: {
    folderName: '1_Program',
    files: [
      'Suuri bolovsroliin surgaltiin hutulbur.pdf',
    ],
  },
  criteria: {
    folderName: '2_Criteria',
    files: [
      'Biologi-Unelgeenii shalguur.pdf',
      'Fizik-Unelgeenii shalguur.pdf',
      'Gazar_zui-Unelgeenii shalguur.pdf',
      'Khimi-Unelgeenii shalguur.pdf',
      'Tuukh-Unelgeenii shalguur.pdf',
      'Uran_zkkhiol-Unelgeenii shalguur.pdf',
    ],
  },
  textbooks: {
    fileName: '3_Textbooks.docx',
    links: [
      {
        grade: '6-р анги',
        subjects: ['Уран зохиол', 'Түүх', 'Байгалийн ухаан'],
        url: 'https://econtent.edu.mn/book/6rangi',
      },
      {
        grade: '7-р анги',
        subjects: ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'],
        url: 'https://econtent.edu.mn/book/7rangi',
      },
      {
        grade: '8-р анги',
        subjects: ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'],
        url: 'https://econtent.edu.mn/book/8rangi',
      },
      {
        grade: '9-р анги',
        subjects: ['Уран зохиол', 'Хими', 'Биологи', 'Түүх', 'Физик', 'Газар зүй'],
        url: 'https://econtent.edu.mn/book/9rangi',
      },
    ],
  },
};