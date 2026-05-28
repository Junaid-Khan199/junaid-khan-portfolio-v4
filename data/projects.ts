export type Project = {
  id: string
  title: string
  shortTitle: string
  category: 'Excel' | 'Python' | 'SQL' | 'Power BI'
  emoji: string
  color: string
  accentColor: string
  description: string
  longDescription: string
  tools: string[]
  github?: string
  live?: string
  featured: boolean
  impact: string
  impactColor: string
  status: 'completed' | 'published' | 'client'
  // Dashboard data
  kpis: { label: string; value: string; unit?: string; change?: string; up?: boolean }[]
  charts: ChartData[]
  // Dataset info for SQL/Python sections
  dataset?: {
    name: string
    rows: number
    columns: number
    githubCsv?: string
    description: string
    sampleSql?: string[]
    samplePython?: string[]
  }
  insights: string[]
  keyInsight: string
}

export type ChartData = {
  type: 'bar' | 'line' | 'area' | 'pie' | 'horizontal-bar'
  title: string
  data: Record<string, string | number>[]
  xKey?: string
  yKeys?: { key: string; color: string; label: string }[]
  colors?: string[]
}

export const projects: Project[] = [
  {
    id: 'saudi-retail',
    title: 'Saudi Retail Analytics & Business Intelligence',
    shortTitle: 'Saudi Retail BI',
    category: 'Excel',
    emoji: '🏪',
    color: '#064e3b',
    accentColor: '#10b981',
    description: 'End-to-end retail BI solution on a self-created messy dataset. Automated ETL pipeline, relational data model, and two executive dashboards.',
    longDescription: 'Complete retail business intelligence solution built using Excel, Power Query, Power Pivot, and DAX. Dataset was self-created and intentionally messy to simulate real-world raw data scenarios.',
    tools: ['Excel', 'Power Query', 'Power Pivot', 'DAX', 'ETL'],
    github: 'https://github.com/Junaid-Khan199/saudi-retail-analytics-Project',
    featured: true,
    impact: 'High Impact',
    impactColor: '#10b981',
    status: 'completed',
    kpis: [
      { label: 'Gross Sales', value: '149.52M', unit: 'SAR', change: '+12.4%', up: true },
      { label: 'Net Revenue', value: '127.02M', unit: 'SAR', change: '+9.8%', up: true },
      { label: 'Total Orders', value: '106,356', change: '+7.2%', up: true },
      { label: 'Profit Margin', value: '4.86', unit: '%', change: '-0.3%', up: false },
      { label: 'Customers', value: '11,300+', change: '+15.1%', up: true },
      { label: 'Return Rate', value: '4.41', unit: '%', change: '+0.2%', up: false },
    ],
    charts: [
      {
        type: 'area',
        title: 'Monthly Revenue & Profit (M SAR)',
        data: [
          { month: 'Oct', revenue: 28.4, profit: 1.38, returns: 1.26 },
          { month: 'Nov', revenue: 26.9, profit: 1.31, returns: 1.19 },
          { month: 'Dec', revenue: 32.1, profit: 1.56, returns: 1.41 },
          { month: 'Jan', revenue: 20.8, profit: 1.01, returns: 0.92 },
          { month: 'Feb', revenue: 23.8, profit: 1.16, returns: 1.05 },
        ],
        xKey: 'month',
        yKeys: [
          { key: 'revenue', color: '#22d3ee', label: 'Revenue' },
          { key: 'profit', color: '#10b981', label: 'Profit' },
          { key: 'returns', color: '#f87171', label: 'Returns' },
        ],
      },
      {
        type: 'bar',
        title: 'Regional Sales vs Target (M SAR)',
        data: [
          { region: 'Riyadh', actual: 42.1, target: 40 },
          { region: 'Jeddah', actual: 31.8, target: 35 },
          { region: 'Dammam', actual: 27.4, target: 25 },
          { region: 'Makkah', actual: 22.9, target: 20 },
          { region: 'Medina', actual: 18.3, target: 22 },
        ],
        xKey: 'region',
        yKeys: [
          { key: 'actual', color: '#22d3ee', label: 'Actual' },
          { key: 'target', color: '#30363d', label: 'Target' },
        ],
      },
      {
        type: 'pie',
        title: 'Sales by Category',
        data: [
          { name: 'Electronics', value: 35 },
          { name: 'Home Appliances', value: 22 },
          { name: 'Baby Products', value: 15 },
          { name: 'Grocery', value: 12 },
          { name: 'Beauty', value: 10 },
          { name: 'Stationery', value: 6 },
        ],
        colors: ['#22d3ee', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#64748b'],
      },
    ],
    dataset: {
      name: 'Saudi Retail Dataset',
      rows: 106356,
      columns: 18,
      description: 'Self-created retail dataset with 5 months of transactions across 20 stores in Saudi Arabia.',
      sampleSql: [
        `-- Monthly Revenue Summary
SELECT 
  strftime('%Y-%m', sale_date) AS month,
  SUM(gross_sales) AS total_revenue,
  SUM(profit) AS total_profit,
  ROUND(SUM(profit)/SUM(gross_sales)*100, 2) AS margin_pct
FROM transactions
GROUP BY month
ORDER BY month;`,
        `-- Top Categories by Revenue
SELECT 
  category,
  SUM(revenue) AS total_revenue,
  COUNT(*) AS total_orders,
  ROUND(AVG(profit_margin), 2) AS avg_margin
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY category
ORDER BY total_revenue DESC
LIMIT 10;`,
        `-- Regional Performance vs Target
SELECT 
  r.region_name,
  SUM(s.net_sales) AS actual_sales,
  r.sales_target,
  ROUND((SUM(s.net_sales) - r.sales_target) / r.sales_target * 100, 1) AS variance_pct
FROM sales s
JOIN stores st ON s.store_id = st.id
JOIN regions r ON st.region_id = r.id
GROUP BY r.region_name, r.sales_target
ORDER BY actual_sales DESC;`,
      ],
      samplePython: [
        `import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv('saudi_retail.csv')
df['sale_date'] = pd.to_datetime(df['sale_date'])

# Monthly revenue trend
monthly = df.groupby(df['sale_date'].dt.to_period('M')).agg(
    revenue=('gross_sales', 'sum'),
    profit=('profit', 'sum'),
    orders=('order_id', 'count')
).reset_index()

print(monthly.head())
print(f"\\nTotal Revenue: {df['gross_sales'].sum():,.2f} SAR")
print(f"Total Profit: {df['profit'].sum():,.2f} SAR")
print(f"Profit Margin: {df['profit'].sum()/df['gross_sales'].sum()*100:.2f}%")`,
        `# Category Analysis
category_stats = df.groupby('category').agg(
    revenue=('gross_sales', 'sum'),
    profit=('profit', 'sum'),
    orders=('order_id', 'count'),
    return_rate=('is_returned', 'mean')
).round(2).sort_values('revenue', ascending=False)

print(category_stats.to_string())`,
      ],
    },
    insights: [
      '149.52M SAR Gross Sales tracked across 5 months',
      'Automated ETL — new files auto-process on folder refresh',
      'Cost-to-revenue ratio ~95% flagging tight margin risk',
      'December 2025 recorded peak monthly sales of 32.1M SAR',
      'Electronics drives 35% of total revenue',
    ],
    keyInsight: 'Cost-to-revenue ratio at ~95% makes profitability extremely sensitive to discounts. A 1% discount reduction adds ~1.49M SAR directly to profit.',
  },

  {
    id: 'oral-cancer-ml',
    title: 'Oral Cancer Early Detection — Published ML Research',
    shortTitle: 'Oral Cancer ML',
    category: 'Python',
    emoji: '🧬',
    color: '#2e1065',
    accentColor: '#8b5cf6',
    description: 'Published peer-reviewed ML research on 84,922 patient records. Comparative evaluation of 7 ML algorithms for early oral cancer detection.',
    longDescription: 'Full machine learning pipeline on 84,922 patient records to build a clinical decision-support system. Published open-access in Journal of Multidisciplinary Applications in Statistical Science (Vol. 1, No. 1, 2025).',
    tools: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn', 'NumPy'],
    live: 'https://journals.rtsolz.com/index.php/JMASS/article/view/5',
    featured: true,
    impact: 'Published',
    impactColor: '#8b5cf6',
    status: 'published',
    kpis: [
      { label: 'Patient Records', value: '84,922', change: 'Dataset size', up: true },
      { label: 'Best Accuracy', value: '97', unit: '%', change: 'Random Forest', up: true },
      { label: 'ROC-AUC Score', value: '0.98', change: 'Random Forest', up: true },
      { label: 'SVM Recall', value: '0.98', change: 'Clinical safety', up: true },
      { label: 'Algorithms', value: '7', change: 'Compared', up: true },
      { label: 'Features', value: '42', change: 'After encoding', up: true },
    ],
    charts: [
      {
        type: 'bar',
        title: 'Model Accuracy Comparison',
        data: [
          { model: 'Random Forest', accuracy: 97, auc: 98 },
          { model: 'SVM', accuracy: 97, auc: 97 },
          { model: 'Log. Reg.', accuracy: 96, auc: 96 },
          { model: 'Grad. Boost', accuracy: 95, auc: 96 },
          { model: 'Decision Tree', accuracy: 93, auc: 93 },
          { model: 'KNN', accuracy: 92, auc: 92 },
          { model: 'Naive Bayes', accuracy: 91, auc: 91 },
        ],
        xKey: 'model',
        yKeys: [
          { key: 'accuracy', color: '#8b5cf6', label: 'Accuracy %' },
          { key: 'auc', color: '#22d3ee', label: 'ROC-AUC %' },
        ],
      },
      {
        type: 'pie',
        title: 'Key Risk Factor Contribution',
        data: [
          { name: 'Tumor Stage', value: 28 },
          { name: 'Lifestyle (Tobacco/Alcohol)', value: 24 },
          { name: 'Tumor Size', value: 18 },
          { name: 'Socioeconomic', value: 15 },
          { name: 'Treatment Cost', value: 10 },
          { name: 'Other', value: 5 },
        ],
        colors: ['#8b5cf6', '#f43f5e', '#22d3ee', '#f59e0b', '#10b981', '#64748b'],
      },
      {
        type: 'bar',
        title: 'Precision / Recall / F1 by Model',
        data: [
          { model: 'RF', precision: 97, recall: 97, f1: 97 },
          { model: 'SVM', precision: 96, recall: 98, f1: 97 },
          { model: 'LR', precision: 96, recall: 96, f1: 96 },
          { model: 'GB', precision: 95, recall: 95, f1: 95 },
          { model: 'DT', precision: 93, recall: 93, f1: 93 },
        ],
        xKey: 'model',
        yKeys: [
          { key: 'precision', color: '#8b5cf6', label: 'Precision' },
          { key: 'recall', color: '#22d3ee', label: 'Recall' },
          { key: 'f1', color: '#10b981', label: 'F1 Score' },
        ],
      },
    ],
    dataset: {
      name: 'Oral Cancer Patient Dataset',
      rows: 84922,
      columns: 25,
      description: 'Healthcare dataset with demographic, lifestyle, clinical, and socioeconomic attributes for oral cancer prediction.',
      sampleSql: [
        `-- Risk Factor Analysis
SELECT 
  tobacco_use,
  alcohol_use,
  COUNT(*) AS patient_count,
  AVG(CASE WHEN diagnosis = 'Malignant' THEN 1.0 ELSE 0.0 END) AS cancer_rate
FROM patients
GROUP BY tobacco_use, alcohol_use
ORDER BY cancer_rate DESC;`,
        `-- Tumor Stage Distribution
SELECT 
  tumor_stage,
  COUNT(*) AS cases,
  ROUND(AVG(survival_time_months), 1) AS avg_survival_months,
  ROUND(AVG(treatment_cost_usd), 0) AS avg_treatment_cost
FROM patients
WHERE tumor_stage IS NOT NULL
GROUP BY tumor_stage
ORDER BY tumor_stage;`,
      ],
      samplePython: [
        `import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score

# Load and prepare data
df = pd.read_csv('oral_cancer_dataset.csv')
X = df.drop('diagnosis', axis=1)
y = (df['diagnosis'] == 'Malignant').astype(int)

# Train/test split (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training samples: {len(X_train):,}")
print(f"Testing samples: {len(X_test):,}")
print(f"Cancer rate: {y.mean():.2%}")`,
        `# Train Random Forest (Best Model)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_test, rf.predict_proba(X_test)[:,1])

print(f"Random Forest Results:")
print(f"  Accuracy:  {accuracy:.2%}")
print(f"  ROC-AUC:   {auc:.4f}")

# Top 5 Feature Importance
feat_imp = pd.Series(rf.feature_importances_, index=X.columns)
print("\\nTop 5 Features:")
print(feat_imp.nlargest(5).to_string())`,
      ],
    },
    insights: [
      'Random Forest: 97% accuracy, ROC-AUC 0.98',
      'SVM: 97% accuracy, Recall 0.98 — best for clinical safety',
      'Tumor stage and lifestyle factors are top predictors',
      '84,922 patient records analysed',
      'Published open-access in peer-reviewed indexed journal',
    ],
    keyInsight: 'SVM achieved highest recall (0.98) — critical for clinical use where false negatives are dangerous. Random Forest best overall with AUC of 0.98.',
  },

  {
    id: 'superstore',
    title: 'Superstore Sales, Returns & Profit Dashboard',
    shortTitle: 'Superstore Sales',
    category: 'Excel',
    emoji: '🏬',
    color: '#083344',
    accentColor: '#22d3ee',
    description: 'Retail Kaggle dataset analysis: $2.29M sales, $285K profit. Identified -$17.7K loss in Tables and 18% margin opportunity in Technology.',
    longDescription: 'Analyzed Kaggle Superstore dataset using Advanced Excel, Pivot Tables, and Power Query. Built interactive dashboards revealing profitability gaps and regional performance.',
    tools: ['Excel', 'Pivot Tables', 'Power Query', 'Dashboard', 'Data Cleaning'],
    github: 'https://github.com/Junaid-Khan199/SUPERSTORE-SALES-RETURNS-PROFIT-ANALYSIS-DASHBOARD-EXCEL-',
    featured: true,
    impact: 'Business Insights',
    impactColor: '#22d3ee',
    status: 'completed',
    kpis: [
      { label: 'Total Sales', value: '$2.29M', change: '+8.3%', up: true },
      { label: 'Total Profit', value: '$285K', change: '+3.1%', up: true },
      { label: 'Avg Margin', value: '12', unit: '%', change: '-1.2%', up: false },
      { label: 'Return Rate', value: '8', unit: '%', change: '+0.5%', up: false },
      { label: 'Total Orders', value: '9,994', change: '+5.8%', up: true },
      { label: 'Tables Loss', value: '-$17.7K', change: 'Net loss', up: false },
    ],
    charts: [
      {
        type: 'bar',
        title: 'Profit by Sub-Category',
        data: [
          { name: 'Copiers', profit: 55618 },
          { name: 'Phones', profit: 44516 },
          { name: 'Accessories', profit: 41937 },
          { name: 'Paper', profit: 34054 },
          { name: 'Binders', profit: 30222 },
          { name: 'Chairs', profit: 26590 },
          { name: 'Bookcases', profit: -3473 },
          { name: 'Supplies', profit: -1189 },
          { name: 'Tables', profit: -17725 },
        ],
        xKey: 'name',
        yKeys: [{ key: 'profit', color: '#22d3ee', label: 'Profit ($)' }],
      },
      {
        type: 'pie',
        title: 'Sales by Category',
        data: [
          { name: 'Technology', value: 36 },
          { name: 'Furniture', value: 32 },
          { name: 'Office Supplies', value: 32 },
        ],
        colors: ['#22d3ee', '#8b5cf6', '#10b981'],
      },
      {
        type: 'bar',
        title: 'Regional Sales & Profit',
        data: [
          { region: 'West', sales: 725458, profit: 108418 },
          { region: 'East', sales: 678781, profit: 91523 },
          { region: 'Central', sales: 501240, profit: 39706 },
          { region: 'South', sales: 391722, profit: 46749 },
        ],
        xKey: 'region',
        yKeys: [
          { key: 'sales', color: '#22d3ee', label: 'Sales ($)' },
          { key: 'profit', color: '#10b981', label: 'Profit ($)' },
        ],
      },
    ],
    dataset: {
      name: 'Superstore Sales Dataset',
      rows: 9994,
      columns: 21,
      description: 'Kaggle Superstore dataset with 4 years of retail sales across USA regions, categories, and customer segments.',
      sampleSql: [
        `-- Sub-category Profit Analysis
SELECT 
  sub_category,
  SUM(sales) AS total_sales,
  SUM(profit) AS total_profit,
  ROUND(SUM(profit)/SUM(sales)*100, 2) AS profit_margin
FROM superstore
GROUP BY sub_category
ORDER BY total_profit ASC;`,
        `-- Customer Segment Performance
SELECT 
  segment,
  COUNT(DISTINCT customer_id) AS customers,
  SUM(sales) AS revenue,
  SUM(profit) AS profit,
  ROUND(AVG(discount), 3) AS avg_discount
FROM superstore
GROUP BY segment
ORDER BY profit DESC;`,
      ],
      samplePython: [
        `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('superstore.csv', encoding='latin1')

# Category performance
cat_perf = df.groupby('Category').agg(
    Sales=('Sales', 'sum'),
    Profit=('Profit', 'sum'),
    Orders=('Order ID', 'nunique')
).round(2)
cat_perf['Margin'] = (cat_perf['Profit'] / cat_perf['Sales'] * 100).round(1)

print(cat_perf.to_string())
print(f"\\nTables sub-category loss: \${df[df['Sub-Category']=='Tables']['Profit'].sum():,.0f}")`,
      ],
    },
    insights: [
      'Tables sub-category: -$17.7K net loss (price/cost issue)',
      'Technology: highest margin at 18% — expansion opportunity',
      'West region outperforms all others by 22%',
      'Central region: lowest profit despite 3rd highest sales',
      '8% return rate represents significant profitability drag',
    ],
    keyInsight: 'Tables sub-category operates at -$17.7K net loss. Recommended 15% price review. Technology revealed 18% margin opportunity — focus area for growth.',
  },

  {
    id: 'fish-market',
    title: 'Fish Market Consumer Behavior Analysis',
    shortTitle: 'Fish Market Analysis',
    category: 'Python',
    emoji: '🐟',
    color: '#422006',
    accentColor: '#f59e0b',
    description: 'Client project. ANOVA & Chi-Square hypothesis testing on 200-record dataset to identify 3 key behavioral drivers.',
    longDescription: 'Delivered as a client project. Independently framed research questions and applied statistical hypothesis testing to uncover consumer behavioral patterns.',
    tools: ['Python', 'Pandas', 'SciPy', 'Seaborn', 'Matplotlib', 'ANOVA', 'Chi-Square'],
    github: 'https://github.com/Junaid-Khan199/-Fish-Market-Consumer-Behavior-Analysis',
    featured: false,
    impact: 'Client Project',
    impactColor: '#f59e0b',
    status: 'client',
    kpis: [
      { label: 'Records', value: '200', change: 'Dataset size', up: true },
      { label: 'Key Drivers', value: '3', change: 'Identified', up: true },
      { label: 'Tests Run', value: '2', change: 'ANOVA + Chi²', up: true },
      { label: 'P-value', value: '<0.05', change: 'Significant', up: true },
      { label: 'Variables', value: '8', change: 'Analyzed', up: true },
      { label: 'Segments', value: '4', change: 'Consumer groups', up: true },
    ],
    charts: [
      {
        type: 'bar',
        title: 'Buying Reason by Education Level',
        data: [
          { education: 'Primary', nutrition: 30, taste: 55, price: 15 },
          { education: 'Secondary', nutrition: 45, taste: 40, price: 15 },
          { education: 'University', nutrition: 65, taste: 25, price: 10 },
          { education: 'Postgrad', nutrition: 78, taste: 18, price: 4 },
        ],
        xKey: 'education',
        yKeys: [
          { key: 'nutrition', color: '#10b981', label: 'Nutrition' },
          { key: 'taste', color: '#f59e0b', label: 'Taste' },
          { key: 'price', color: '#f43f5e', label: 'Price' },
        ],
      },
      {
        type: 'pie',
        title: 'Fish Size Preference by Household',
        data: [
          { name: 'Small (Single HH)', value: 35 },
          { name: 'Medium (Nuclear)', value: 40 },
          { name: 'Large (Joint HH)', value: 25 },
        ],
        colors: ['#22d3ee', '#f59e0b', '#8b5cf6'],
      },
      {
        type: 'bar',
        title: 'Purchase Frequency by Socioeconomic Status',
        data: [
          { ses: 'Low', weekly: 55, monthly: 35, rarely: 10 },
          { ses: 'Middle', weekly: 40, monthly: 45, rarely: 15 },
          { ses: 'High', weekly: 25, monthly: 40, rarely: 35 },
        ],
        xKey: 'ses',
        yKeys: [
          { key: 'weekly', color: '#10b981', label: 'Weekly' },
          { key: 'monthly', color: '#22d3ee', label: 'Monthly' },
          { key: 'rarely', color: '#f43f5e', label: 'Rarely' },
        ],
      },
    ],
    dataset: {
      name: 'Fish Market Consumer Dataset',
      rows: 200,
      columns: 8,
      description: 'Fish market consumer survey data with demographic and behavioral variables from a local market.',
      sampleSql: [
        `-- Buying Reason by Education
SELECT 
  education_level,
  buying_reason,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY education_level), 1) AS pct
FROM consumers
GROUP BY education_level, buying_reason
ORDER BY education_level, count DESC;`,
      ],
      samplePython: [
        `import pandas as pd
from scipy import stats

df = pd.read_csv('fish_market_consumers.csv')

# Chi-Square: Education vs Buying Reason
contingency = pd.crosstab(df['education'], df['buying_reason'])
chi2, p_val, dof, expected = stats.chi2_contingency(contingency)

print(f"Chi-Square Test: Education vs Buying Reason")
print(f"  Chi2 statistic: {chi2:.4f}")
print(f"  P-value: {p_val:.4f}")
print(f"  Degrees of freedom: {dof}")
print(f"  Significant: {'Yes' if p_val < 0.05 else 'No'}")`,
        `# ANOVA: SES vs Purchase Frequency
groups = [df[df['ses']==s]['purchase_freq'].values 
          for s in df['ses'].unique()]
f_stat, p_val = stats.f_oneway(*groups)

print(f"ANOVA: Socioeconomic Status vs Purchase Frequency")
print(f"  F-statistic: {f_stat:.4f}")
print(f"  P-value: {p_val:.4f}")
print(f"  Result: {'Significant difference exists' if p_val < 0.05 else 'No significant difference'}")`,
      ],
    },
    insights: [
      'Education level significantly influences buying motivation (Chi² p<0.05)',
      'Joint households prefer large fish; single households prefer small',
      'Higher SES correlates with lower purchase frequency',
      'University+ educated buyers prioritise nutrition over taste',
      'Price sensitivity highest in primary education group',
    ],
    keyInsight: 'Three statistically significant behavioral drivers identified: education → buying reason, household type → fish size preference, SES → purchase frequency.',
  },
]

export const getProjectById = (id: string) => projects.find(p => p.id === id)
export const getProjectsByCategory = (cat: string) =>
  cat === 'all' ? projects : projects.filter(p => p.category === cat)
