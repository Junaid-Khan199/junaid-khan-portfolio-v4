export type SqlResult = {
    columns: string[]
    rows: (string | number)[][]
}

export const SQL_MOCK_RESULTS: Record<string, SqlResult> = {
    // Saudi Retail BI
    "saudi-retail-0": {
        columns: ["month", "total_revenue", "total_profit", "margin_pct"],
        rows: [
            ["2025-10", "28,400,000", "1,380,000", "4.86"],
            ["2025-11", "26,900,000", "1,310,000", "4.87"],
            ["2025-12", "32,100,000", "1,560,000", "4.86"],
            ["2026-01", "20,800,000", "1,010,000", "4.86"],
            ["2026-02", "23,800,000", "1,160,000", "4.87"],
        ],
    },
    "saudi-retail-1": {
        columns: ["category", "total_revenue", "total_orders", "avg_margin"],
        rows: [
            ["Electronics", "52,300,000", "37,225", "5.12"],
            ["Home Appliances", "32,800,000", "23,398", "4.98"],
            ["Baby Products", "22,400,000", "15,953", "4.75"],
            ["Grocery", "17,900,000", "12,744", "4.31"],
            ["Beauty", "14,900,000", "10,613", "4.18"],
            ["Stationery", "8,900,000", "6,342", "3.95"],
        ],
    },
    "saudi-retail-2": {
        columns: ["region_name", "actual_sales", "sales_target", "variance_pct"],
        rows: [
            ["Riyadh", "42,100,000", "40,000,000", "+5.3"],
            ["Jeddah", "31,800,000", "35,000,000", "-9.1"],
            ["Dammam", "27,400,000", "25,000,000", "+9.6"],
            ["Makkah", "22,900,000", "20,000,000", "+14.5"],
            ["Medina", "18,300,000", "22,000,000", "-16.8"],
        ],
    },
    "saudi-retail-3": {
        columns: ["product_name", "category", "profit", "margin_pct"],
        rows: [
            ["Samsung 65\" QLED", "Electronics", "2,840,000", "8.12"],
            ["LG Washing Machine", "Home Appliances", "1,920,000", "7.34"],
            ["Apple iPhone 15", "Electronics", "1,780,000", "6.91"],
            ["Pampers Mega Pack", "Baby Products", "1,340,000", "6.45"],
            ["Sony Headphones", "Electronics", "1,210,000", "6.18"],
        ],
    },
    "saudi-retail-4": {
        columns: ["category", "orders", "total_returns", "return_rate"],
        rows: [
            ["Home Appliances", "23,398", "1,123", "4.80"],
            ["Beauty", "10,613", "489", "4.61"],
            ["Electronics", "37,225", "1,638", "4.40"],
            ["Baby Products", "15,953", "654", "4.10"],
            ["Grocery", "12,744", "392", "3.08"],
            ["Stationery", "6,342", "197", "3.11"],
        ],
    },

    // Oral Cancer ML
    "oral-cancer-ml-0": {
        columns: ["tobacco_use", "alcohol_use", "patients", "cancer_rate"],
        rows: [
            ["Yes", "Yes", "12,847", "0.78"],
            ["Yes", "No", "18,934", "0.62"],
            ["No", "Yes", "9,821", "0.44"],
            ["No", "No", "43,320", "0.18"],
        ],
    },
    "oral-cancer-ml-1": {
        columns: ["tumor_stage", "cases", "avg_survival_months", "avg_cost_usd"],
        rows: [
            ["Stage I", "21,230", "54.3", "8,450"],
            ["Stage II", "25,481", "38.7", "14,200"],
            ["Stage III", "22,147", "22.1", "24,800"],
            ["Stage IV", "16,064", "11.4", "38,600"],
        ],
    },
    "oral-cancer-ml-2": {
        columns: ["model_name", "accuracy", "precision", "recall", "f1_score"],
        rows: [
            ["Random Forest", "0.9700", "0.9712", "0.9688", "0.9700"],
            ["XGBoost", "0.9634", "0.9641", "0.9627", "0.9634"],
            ["Logistic Regression", "0.8821", "0.8834", "0.8808", "0.8821"],
            ["SVM", "0.9102", "0.9118", "0.9086", "0.9102"],
            ["Decision Tree", "0.9241", "0.9253", "0.9229", "0.9241"],
        ],
    },

    // Superstore
    "superstore-0": {
        columns: ["sub_category", "total_sales", "total_profit", "margin"],
        rows: [
            ["Tables", "206,966", "-17,725", "-8.57"],
            ["Bookcases", "114,880", "-3,473", "-3.02"],
            ["Supplies", "46,674", "-1,189", "-2.55"],
            ["Phones", "330,007", "44,516", "13.49"],
            ["Copiers", "149,528", "55,618", "37.20"],
            ["Accessories", "167,380", "41,937", "25.05"],
        ],
    },
    "superstore-1": {
        columns: ["segment", "customers", "revenue", "profit"],
        rows: [
            ["Consumer", "5,191", "1,161,401", "134,119"],
            ["Corporate", "3,020", "706,146", "91,979"],
            ["Home Office", "1,783", "429,653", "60,299"],
        ],
    },
    "superstore-2": {
        columns: ["product_name", "sub_category", "total_profit"],
        rows: [
            ["Cubify CubeX 3D Printer", "Machines", "-8,880"],
            ["Lexmark MX611dhe", "Machines", "-4,560"],
            ["Bevis Round Table", "Tables", "-4,321"],
            ["Bretford CR4500", "Tables", "-3,890"],
            ["GBC DocuBind P400", "Binders", "-3,450"],
            ["Cisco TelePresence", "Phones", "-3,180"],
            ["HP Designjet T520", "Machines", "-2,870"],
            ["Cubify CubeX 3D (Double)", "Machines", "-2,660"],
            ["Ibico EPK-21", "Binders", "-2,340"],
            ["Acco 7-Outlet", "Machines", "-2,100"],
        ],
    },

    // Fish Market
    "fish-market-0": {
        columns: ["education_level", "buying_reason", "respondents", "pct"],
        rows: [
            ["University", "Nutrition", "78", "65.0"],
            ["University", "Taste", "30", "25.0"],
            ["University", "Price", "12", "10.0"],
            ["Secondary", "Taste", "44", "44.0"],
            ["Secondary", "Nutrition", "40", "40.0"],
            ["Secondary", "Price", "16", "16.0"],
            ["Primary", "Taste", "33", "55.0"],
            ["Primary", "Price", "15", "25.0"],
        ],
    },
    "fish-market-1": {
        columns: ["age_group", "gender", "preference", "count"],
        rows: [
            ["25-34", "Male", "Fresh Fish", "89"],
            ["25-34", "Female", "Fresh Fish", "76"],
            ["35-44", "Male", "Frozen Fish", "64"],
            ["18-24", "Female", "Fresh Fish", "58"],
            ["45-54", "Male", "Fresh Fish", "52"],
            ["35-44", "Female", "Frozen Fish", "47"],
        ],
    },
}

export const PYTHON_MOCK_OUTPUTS: Record<string, string> = {
    // Saudi Retail
    "saudi-retail-0": `Shape: (106356, 14)

First 5 rows:
   order_id       date    category  region      gross_sales    profit  margin
0  ORD-00001  2025-10-01  Electronics  Riyadh    4820.00    234.09   4.86
1  ORD-00002  2025-10-01  Grocery      Jeddah     892.00     38.44   4.31
2  ORD-00003  2025-10-02  Beauty       Dammam    1240.00     51.83   4.18
3  ORD-00004  2025-10-02  Electronics  Riyadh    7380.00    378.28   5.12
4  ORD-00005  2025-10-03  Baby Prod.   Makkah    2100.00     99.75   4.75

Data types:
order_id        object
date            datetime64[ns]
category        object
region          object
gross_sales     float64
profit          float64
margin          float64

Missing values:
order_id       0
date           0
category       0
gross_sales    2
profit         2
dtype: int64`,

    "saudi-retail-1": `Monthly Revenue Summary (SAR):
           gross_sales   net_revenue      profit
month
2025-10   28,400,000    24,140,000    1,380,000
2025-11   26,900,000    22,865,000    1,310,000
2025-12   32,100,000    27,285,000    1,560,000
2026-01   20,800,000    17,680,000    1,010,000
2026-02   23,800,000    20,230,000    1,160,000

Total Gross Sales: 132,000,000.00 SAR
Total Orders:      106,356`,

    "saudi-retail-2": `Category Performance:
                  revenue     orders  avg_margin
category
Electronics    52,300,000   37,225    5.12
Home Apps      32,800,000   23,398    4.98
Baby Products  22,400,000   15,953    4.75
Grocery        17,900,000   12,744    4.31
Beauty         14,900,000   10,613    4.18
Stationery      8,900,000    6,342    3.95`,

    // Oral Cancer ML
    "oral-cancer-ml-0": `Shape: (85000, 16)

First 5 rows:
   patient_id  age tobacco_use alcohol_use  tumor_stage  cancer_diagnosis
0  PAT-00001   45         Yes         Yes    Stage III              1
1  PAT-00002   32          No          No    Stage I               0
2  PAT-00003   58         Yes          No    Stage II              1
3  PAT-00004   41          No         Yes    Stage II              0
4  PAT-00005   67         Yes         Yes    Stage IV              1

Data types:
patient_id          object
age                  int64
tobacco_use         object
alcohol_use         object
tumor_stage         object
cancer_diagnosis     int64

Missing values: 0`,

    "oral-cancer-ml-1": `Summary Statistics:
              age  tumor_size_cm  survival_months  treatment_cost
count   85000.00       85000.00         85000.00        85000.00
mean       54.32           3.21            28.45        21340.00
std        14.87           1.84            18.23        12890.00
min        18.00           0.30             1.00         4200.00
max        95.00           9.80            72.00        68000.00

Cancer rate by tobacco use:
tobacco_use
No     0.2847
Yes    0.6921
Name: cancer_diagnosis, dtype: float64`,

    "oral-cancer-ml-2": `=== Random Forest Results ===
Training samples: 68,000
Testing samples:  17,000

  Accuracy:  97.00%
  ROC-AUC:   0.9812
  Precision: 0.9712
  Recall:    0.9688
  F1-Score:  0.9700

Classification Report:
              precision  recall  f1-score  support
           0     0.971   0.968     0.970     9212
           1     0.971   0.972     0.972     7788

Top 3 Features:
  tumor_stage          : 0.2341
  tumor_size_cm        : 0.1823
  treatment_cost_usd   : 0.1456`,

    "oral-cancer-ml-3": `Survival Analysis by Stage:
           cases  avg_survival  avg_cost
Stage I    21230         54.3    8450.0
Stage II   25481         38.7   14200.0
Stage III  22147         22.1   24800.0
Stage IV   16064         11.4   38600.0`,

    // Superstore
    "superstore-0": `Shape: (9994, 21)

First 5 rows:
   Row ID       Order ID Order Date  Customer Name   Segment  Product Name        Sales  Profit
0       1  CA-2016-152156 2016-11-08   Claire Gute   Consumer  Bush Somerset  261.96   41.91
1       2  CA-2016-152156 2016-11-08   Claire Gute   Consumer  Hammock Chair  731.94  219.58
2       3  CA-2016-138688 2016-06-12  Darrin Van Huff Corporate  Binding Mach  14.62   -6.87
3       4  US-2015-108966 2015-10-11 Sean O'Donnell  Consumer  Eldon Fold    957.58  -383.03
4       5  US-2015-108966 2015-10-11 Sean O'Donnell  Consumer  Eldon Fold    22.37     2.52

Missing values: 0`,

    "superstore-1": `Sub-Category P&L:
                     Sales      Profit  Margin%
Sub-Category
Tables           206965.53  -17724.84    -8.57
Bookcases        114879.99   -3472.56    -3.02
Supplies          46673.54   -1189.10    -2.55
Fasteners          3024.28     949.52    31.40
Labels            12486.31    5546.25    44.42
Copiers          149527.83   55617.82    37.20

Loss-Making Sub-Categories:
  Tables      : -$17,724.84
  Bookcases   : -$3,472.56
  Supplies    : -$1,189.10`,

    // Fish Market
    "fish-market-0": `Shape: (400, 12)

First 5 rows:
   respondent_id  age gender   education_level  buying_reason  purchase_frequency
0            1   28   Male       University        Nutrition               Weekly
1            2   45 Female        Secondary            Taste             Bi-weekly
2            3   32   Male          Primary            Price              Monthly
3            4   56 Female        University        Nutrition               Weekly
4            5   24   Male          Secondary           Taste             Bi-weekly

Buying reasons:
Nutrition    148
Taste        134
Price         80
Habit         38
Name: buying_reason, dtype: int64`,

    "fish-market-1": `Chi-Square Test Results:
  Chi2 Statistic    : 24.3812
  P-value           : 0.0002
  Degrees of Freedom: 6

Significant difference: YES (p < 0.05)

Interpretation: Education level significantly influences fish buying reason.
University graduates prefer Nutrition (65%), while Primary-educated prefer Taste (55%).`,

    "fish-market-2": `One-Way ANOVA Results:
  F-statistic : 18.4421
  P-value     : 0.0000
  Result      : Significant difference (p < 0.05)

Group Means (Purchase Frequency score):
  High Income    : 4.82
  Middle Income  : 3.91
  Low Income     : 2.74

Interpretation: Income level significantly affects fish purchase frequency.`,
}

export function getSqlResult(projectId: string, queryIdx: number): SqlResult {
    // Try exact project id match
    const key = `${projectId}-${queryIdx}`
    if (SQL_MOCK_RESULTS[key]) return SQL_MOCK_RESULTS[key]

    // Try partial match (e.g. "saudi-retail-analytics" → "saudi-retail")
    const partialKey = Object.keys(SQL_MOCK_RESULTS).find(k => {
        const base = k.split("-").slice(0, -1).join("-")
        return projectId.toLowerCase().includes(base) && k.endsWith(`-${queryIdx}`)
    })
    if (partialKey) return SQL_MOCK_RESULTS[partialKey]

    return {
        columns: ["result"],
        rows: [["Query executed successfully — dataset loaded, 0 rows matched your filter."]],
    }
}

export function getPythonOutput(projectId: string, snippetIdx: number): string {
    const key = `${projectId}-${snippetIdx}`
    if (PYTHON_MOCK_OUTPUTS[key]) return PYTHON_MOCK_OUTPUTS[key]

    // Partial match
    const partialKey = Object.keys(PYTHON_MOCK_OUTPUTS).find(k => {
        const base = k.split("-").slice(0, -1).join("-")
        return projectId.toLowerCase().includes(base) && k.endsWith(`-${snippetIdx}`)
    })
    if (partialKey) return PYTHON_MOCK_OUTPUTS[partialKey]

    return "Script executed successfully.\n(No output — add print() statements to see results)"
}
