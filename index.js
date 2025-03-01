import { Bot, session } from "grammy";
import { createClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = 'https://qmnhyaqrarwkwgnrxefl.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize bot
const bot = new Bot(BOT_TOKEN);

// Language translations
const translations = {
  en: {
    welcome: "Welcome to Budget Tracker Bot! Choose your language:",
    languageSet: "Language set to English!",
    mainMenu: "📊 *Budget Tracker* - Main Menu\n\nWhat would you like to do?",
    addIncome: "💰 Add Income",
    addExpense: "💸 Add Expense",
    viewBalance: "📈 View Balance",
    viewReports: "📊 View Reports",
    manageBudgets: "⚙️ Manage Budget Limits",
    exportData: "📤 Export Data",
    settings: "🔧 Settings",
    selectCategory: "Please select a category:",
    enterAmount: "Please enter the amount:",
    incomeAdded: "Income added successfully!",
    expenseAdded: "Expense added successfully!",
    invalidAmount: "Invalid amount. Please enter a number.",
    categories: {
      income: ["Salary", "Freelance", "Investments", "Gifts", "Other"],
      expense: ["Food", "Transportation", "Housing", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"]
    },
    balance: {
      title: "📈 *Your Balance Summary*",
      income: "Total Income: ",
      expense: "Total Expenses: ",
      balance: "Current Balance: ",
      period: "Period: "
    },
    reports: {
      title: "📊 *Spending Reports*",
      selectPeriod: "Select period:",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      byCategory: "Expenses by Category:",
      noData: "No data available for this period."
    },
    budgets: {
      title: "⚙️ *Budget Limits*",
      current: "Current budget limits:",
      set: "Set budget for:",
      enterLimit: "Enter budget limit for",
      limitSet: "Budget limit set successfully!",
      warning: "⚠️ Warning: You've reached {percent}% of your budget for {category}",
      exceeded: "🚨 Alert: You've exceeded your budget for {category}!"
    },
    export: {
      title: "📤 *Export Data*",
      selectFormat: "Select export format:",
      text: "Text",
      csv: "CSV",
      preparing: "Preparing your data...",
      ready: "Here's your exported data:"
    },
    back: "⬅️ Back",
    cancel: "❌ Cancel"
  },
  ar: {
    welcome: "مرحبًا بك في روبوت تتبع الميزانية! اختر لغتك:",
    languageSet: "تم ضبط اللغة على العربية!",
    mainMenu: "📊 *تتبع الميزانية* - القائمة الرئيسية\n\nماذا تريد أن تفعل؟",
    addIncome: "💰 إضافة دخل",
    addExpense: "💸 إضافة مصروف",
    viewBalance: "📈 عرض الرصيد",
    viewReports: "📊 عرض التقارير",
    manageBudgets: "⚙️ إدارة حدود الميزانية",
    exportData: "📤 تصدير البيانات",
    settings: "🔧 الإعدادات",
    selectCategory: "الرجاء اختيار فئة:",
    enterAmount: "الرجاء إدخال المبلغ:",
    incomeAdded: "تمت إضافة الدخل بنجاح!",
    expenseAdded: "تمت إضافة المصروف بنجاح!",
    invalidAmount: "مبلغ غير صالح. الرجاء إدخال رقم.",
    categories: {
      income: ["راتب", "عمل حر", "استثمارات", "هدايا", "أخرى"],
      expense: ["طعام", "مواصلات", "سكن", "ترفيه", "رعاية صحية", "تسوق", "مرافق", "أخرى"]
    },
    balance: {
      title: "📈 *ملخص رصيدك*",
      income: "إجمالي الدخل: ",
      expense: "إجمالي المصروفات: ",
      balance: "الرصيد الحالي: ",
      period: "الفترة: "
    },
    reports: {
      title: "📊 *تقارير الإنفاق*",
      selectPeriod: "اختر الفترة:",
      daily: "يومي",
      weekly: "أسبوعي",
      monthly: "شهري",
      yearly: "سنوي",
      byCategory: "المصروفات حسب الفئة:",
      noData: "لا توجد بيانات متاحة لهذه الفترة."
    },
    budgets: {
      title: "⚙️ *حدود الميزانية*",
      current: "حدود الميزانية الحالية:",
      set: "تعيين ميزانية لـ:",
      enterLimit: "أدخل حد الميزانية لـ",
      limitSet: "تم تعيين حد الميزانية بنجاح!",
      warning: "⚠️ تحذير: لقد وصلت إلى {percent}% من ميزانيتك لـ {category}",
      exceeded: "🚨 تنبيه: لقد تجاوزت ميزانيتك لـ {category}!"
    },
    export: {
      title: "📤 *تصدير البيانات*",
      selectFormat: "اختر تنسيق التصدير:",
      text: "نص",
      csv: "CSV",
      preparing: "جاري تحضير بياناتك...",
      ready: "إليك بياناتك المصدرة:"
    },
    back: "⬅️ رجوع",
    cancel: "❌ إلغاء"
  }
};

// Session middleware to store user data
bot.use(session({
  initial: () => ({
    language: "en",
    step: "idle",
    transactionType: null,
    category: null,
    tempData: {}
  })
}));

// Helper function to get text based on user language
function getText(ctx, key) {
  const lang = ctx.session.language || "en";
  const keys = key.split('.');
  let text = translations[lang];
  
  for (const k of keys) {
    if (text[k] === undefined) return key;
    text = text[k];
  }
  
  return text;
}

// Database initialization
async function initializeDatabase() {
  // Create users table
  const { error: usersError } = await supabase.schema.createTable('users', [
    { name: 'user_id', type: 'text', primaryKey: true },
    { name: 'language', type: 'text', defaultValue: 'en' },
    { name: 'created_at', type: 'timestamp', defaultValue: 'now()' }
  ]);

  // Create transactions table
  const { error: transactionsError } = await supabase.schema.createTable('transactions', [
    { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
    { name: 'user_id', type: 'text', notNull: true },
    { name: 'type', type: 'text', notNull: true }, // 'income' or 'expense'
    { name: 'category', type: 'text', notNull: true },
    { name: 'amount', type: 'numeric', notNull: true },
    { name: 'date', type: 'timestamp', defaultValue: 'now()' },
    { name: 'description', type: 'text' }
  ]);

  // Create budget_limits table
  const { error: budgetsError } = await supabase.schema.createTable('budget_limits', [
    { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
    { name: 'user_id', type: 'text', notNull: true },
    { name: 'category', type: 'text', notNull: true },
    { name: 'amount', type: 'numeric', notNull: true },
    { name: 'period', type: 'text', defaultValue: 'monthly' }, // 'daily', 'weekly', 'monthly', 'yearly'
    { name: 'created_at', type: 'timestamp', defaultValue: 'now()' },
    { name: 'updated_at', type: 'timestamp', defaultValue: 'now()' }
  ]);

  if (usersError || transactionsError || budgetsError) {
    console.error("Database initialization error:", usersError || transactionsError || budgetsError);
  }
}

// User management
async function getOrCreateUser(userId, language = "en") {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ user_id: userId, language }])
      .select();

    if (createError) {
      console.error("Error creating user:", createError);
      return null;
    }
    return newUser[0];
  }

  return data;
}

// Transaction management
async function addTransaction(userId, type, category, amount, description = "") {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      type,
      category,
      amount,
      description
    }])
    .select();

  if (error) {
    console.error("Error adding transaction:", error);
    return null;
  }

  // Check budget limits if it's an expense
  if (type === 'expense') {
    await checkBudgetLimits(userId, category);
  }

  return data[0];
}

async function getTransactions(userId, period = 'all') {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  const now = new Date();
  
  if (period === 'daily') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    query = query.gte('date', today);
  } else if (period === 'weekly') {
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
    query = query.gte('date', weekStart);
  } else if (period === 'monthly') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    query = query.gte('date', monthStart);
  } else if (period === 'yearly') {
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
    query = query.gte('date', yearStart);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}

// Budget management
async function setBudgetLimit(userId, category, amount, period = 'monthly') {
  // Check if budget limit already exists
  const { data: existingBudget } = await supabase
    .from('budget_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('period', period)
    .single();

  if (existingBudget) {
    // Update existing budget
    const { data, error } = await supabase
      .from('budget_limits')
      .update({ amount, updated_at: new Date().toISOString() })
      .eq('id', existingBudget.id)
      .select();

    if (error) {
      console.error("Error updating budget limit:", error);
      return null;
    }
    return data[0];
  } else {
    // Create new budget
    const { data, error } = await supabase
      .from('budget_limits')
      .insert([{
        user_id: userId,
        category,
        amount,
        period
      }])
      .select();

    if (error) {
      console.error("Error setting budget limit:", error);
      return null;
    }
    return data[0];
  }
}

async function getBudgetLimits(userId, period = 'monthly') {
  const { data, error } = await supabase
    .from('budget_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('period', period);

  if (error) {
    console.error("Error fetching budget limits:", error);
    return [];
  }

  return data;
}

async function checkBudgetLimits(userId, category) {
  // Get the budget limit for this category
  const { data: budgetLimit } = await supabase
    .from('budget_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('period', 'monthly')
    .single();

  if (!budgetLimit) return null; // No budget set

  // Get current month's expenses for this category
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const { data: expenses } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .eq('category', category)
    .gte('date', monthStart);

  if (!expenses) return null;

  // Calculate total spent
  const totalSpent = expenses.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  const budgetAmount = parseFloat(budgetLimit.amount);
  const percentage = (totalSpent / budgetAmount) * 100;

  // Return warning level
  if (percentage >= 100) {
    return { exceeded: true, percentage, category, budgetAmount };
  } else if (percentage >= 80) {
    return { warning: true, percentage, category, budgetAmount };
  }

  return null;
}

// Report generation
async function generateCategoryReport(userId, period = 'monthly') {
  const transactions = await getTransactions(userId, period);
  
  // Group expenses by category
  const expensesByCategory = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const category = transaction.category;
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = 0;
      }
      expensesByCategory[category] += parseFloat(transaction.amount);
    }
  });

  return expensesByCategory;
}

// Data export
function exportAsText(transactions, language = 'en') {
  const lang = translations[language];
  let text = `${lang.export.title}\n\n`;
  
  // Add balance summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  text += `${lang.balance.income}${totalIncome.toFixed(2)}\n`;
  text += `${lang.balance.expense}${totalExpense.toFixed(2)}\n`;
  text += `${lang.balance.balance}${(totalIncome - totalExpense).toFixed(2)}\n\n`;
  
  // Add transactions
  text += "--- Transactions ---\n\n";
  
  transactions.forEach(t => {
    const date = new Date(t.date).toLocaleDateString();
    text += `${date} | ${t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)} | ${t.category}`;
    if (t.description) text += ` | ${t.description}`;
    text += '\n';
  });
  
  return text;
}

function exportAsCSV(transactions) {
  let csv = "Date,Type,Category,Amount,Description\n";
  
  transactions.forEach(t => {
    const date = new Date(t.date).toLocaleDateString();
    const amount = parseFloat(t.amount).toFixed(2);
    const description = t.description ? `"${t.description.replace(/"/g, '""')}"` : "";
    
    csv += `${date},${t.type},${t.category},${amount},${description}\n`;
  });
  
  return csv;
}

// Command handlers
bot.command("start", async (ctx) => {
  const userId = ctx.from.id.toString();
  await getOrCreateUser(userId);
  
  await ctx.reply(
    "Welcome to Budget Tracker Bot! Choose your language:\n\nمرحبًا بك في روبوت تتبع الميزانية! اختر لغتك:",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "English 🇬🇧", callback_data: "lang_en" },
            { text: "العربية 🇸🇦", callback_data: "lang_ar" }
          ]
        ]
      }
    }
  );
});

// Language selection
bot.callbackQuery(/^lang_(.+)$/, async (ctx) => {
  const lang = ctx.match[1];
  ctx.session.language = lang;
  
  const userId = ctx.from.id.toString();
  await supabase
    .from('users')
    .update({ language: lang })
    .eq('user_id', userId);
  
  await ctx.answerCallbackQuery();
  await ctx.reply(getText(ctx, 'languageSet'));
  
  // Show main menu
  await showMainMenu(ctx);
});

async function showMainMenu(ctx) {
  await ctx.reply(getText(ctx, 'mainMenu'), {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: getText(ctx, 'addIncome'), callback_data: "action_income" },
          { text: getText(ctx, 'addExpense'), callback_data: "action_expense" }
        ],
        [
          { text: getText(ctx, 'viewBalance'), callback_data: "action_balance" },
          { text: getText(ctx, 'viewReports'), callback_data: "action_reports" }
        ],
        [
          { text: getText(ctx, 'manageBudgets'), callback_data: "action_budgets" },
          { text: getText(ctx, 'exportData'), callback_data: "action_export" }
        ],
        [
          { text: getText(ctx, 'settings'), callback_data: "action_settings" }
        ]
      ]
    }
  });
}

// Main menu actions
bot.callbackQuery(/^action_(.+)$/, async (ctx) => {
  const action = ctx.match[1];
  
  await ctx.answerCallbackQuery();
  
  if (action === 'income') {
    ctx.session.step = 'select_income_category';
    ctx.session.transactionType = 'income';
    
    const categories = getText(ctx, 'categories.income');
    const keyboard = [];
    
    // Create rows of 2 buttons each
    for (let i = 0; i < categories.length; i += 2) {
      const row = [];
      row.push({ text: categories[i], callback_data: `category_${categories[i]}` });
      
      if (i + 1 < categories.length) {
        row.push({ text: categories[i + 1], callback_data: `category_${categories[i + 1]}` });
      }
      
      keyboard.push(row);
    }
    
    // Add back button
    keyboard.push([{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]);
    
    await ctx.reply(getText(ctx, 'selectCategory'), {
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } else if (action === 'expense') {
    ctx.session.step = 'select_expense_category';
    ctx.session.transactionType = 'expense';
    
    const categories = getText(ctx, 'categories.expense');
    const keyboard = [];
    
    // Create rows of 2 buttons each
    for (let i = 0; i < categories.length; i += 2) {
      const row = [];
      row.push({ text: categories[i], callback_data: `category_${categories[i]}` });
      
      if (i + 1 < categories.length) {
        row.push({ text: categories[i + 1], callback_data: `category_${categories[i + 1]}` });
      }
      
      keyboard.push(row);
    }
    
    // Add back button
    keyboard.push([{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]);
    
    await ctx.reply(getText(ctx, 'selectCategory'), {
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } else if (action === 'balance') {
    await showBalance(ctx);
  } else if (action === 'reports') {
    await showReportOptions(ctx);
  } else if (action === 'budgets') {
    await showBudgetOptions(ctx);
  } else if (action === 'export') {
    await showExportOptions(ctx);
  } else if (action === 'settings') {
    await showSettings(ctx);
  }
});

// Category selection
bot.callbackQuery(/^category_(.+)$/, async (ctx) => {
  const category = ctx.match[1];
  ctx.session.category = category;
  
  await ctx.answerCallbackQuery();
  
  ctx.session.step = 'enter_amount';
  await ctx.reply(getText(ctx, 'enterAmount'));
});

// Back to main menu
bot.callbackQuery("back_to_main", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = 'idle';
  await showMainMenu(ctx);
});

// Handle amount input
bot.on("message:text", async (ctx) => {
  if (ctx.session.step === 'enter_amount') {
    const amount = parseFloat(ctx.message.text.trim());
    
    if (isNaN(amount) || amount <= 0) {
      await ctx.reply(getText(ctx, 'invalidAmount'));
      return;
    }
    
    const userId = ctx.from.id.toString();
    const type = ctx.session.transactionType;
    const category = ctx.session.category;
    
    await addTransaction(userId, type, category, amount);
    
    if (type === 'income') {
      await ctx.reply(getText(ctx, 'incomeAdded'));
    } else {
      await ctx.reply(getText(ctx, 'expenseAdded'));
      
      // Check if budget limit is reached
      const budgetCheck = await checkBudgetLimits(userId, category);
      
      if (budgetCheck && budgetCheck.exceeded) {
        const message = getText(ctx, 'budgets.exceeded')
          .replace('{category}', category);
        await ctx.reply(message);
      } else if (budgetCheck && budgetCheck.warning) {
        const message = getText(ctx, 'budgets.warning')
          .replace('{percent}', Math.round(budgetCheck.percentage))
          .replace('{category}', category);
        await ctx.reply(message);
      }
    }
    
    ctx.session.step = 'idle';
    await showMainMenu(ctx);
  } else if (ctx.session.step === 'enter_budget_limit') {
    const amount = parseFloat(ctx.message.text.trim());
    
    if (isNaN(amount) || amount <= 0) {
      await ctx.reply(getText(ctx, 'invalidAmount'));
      return;
    }
    
    const userId = ctx.from.id.toString();
    const category = ctx.session.category;
    
    await setBudgetLimit(userId, category, amount);
    await ctx.reply(getText(ctx, 'budgets.limitSet'));
    
    ctx.session.step = 'idle';
    await showBudgetOptions(ctx);
  }
});

// Balance functions
async function showBalance(ctx) {
  const userId = ctx.from.id.toString();
  const transactions = await getTransactions(userId, 'monthly');
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = totalIncome - totalExpense;
  
  const now = new Date();
  const monthName = now.toLocaleString(ctx.session.language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' });
  
  let message = `${getText(ctx, 'balance.title')}\n\n`;
  message += `${getText(ctx, 'balance.income')}${totalIncome.toFixed(2)}\n`;
  message += `${getText(ctx, 'balance.expense')}${totalExpense.toFixed(2)}\n`;
  message += `${getText(ctx, 'balance.balance')}${balance.toFixed(2)}\n`;
  message += `${getText(ctx, 'balance.period')}${monthName}`;
  
  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]
      ]
    }
  });
}

// Report functions
async function showReportOptions(ctx) {
  await ctx.reply(getText(ctx, 'reports.title'), {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: getText(ctx, 'reports.daily'), callback_data: "report_daily" },
          { text: getText(ctx, 'reports.weekly'), callback_data: "report_weekly" }
        ],
        [
          { text: getText(ctx, 'reports.monthly'), callback_data: "report_monthly" },
          { text: getText(ctx, 'reports.yearly'), callback_data: "report_yearly" }
        ],
        [{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]
      ]
    }
  });
}

bot.callbackQuery(/^report_(.+)$/, async (ctx) => {
  const period = ctx.match[1];
  await ctx.answerCallbackQuery();
  
  const userId = ctx.from.id.toString();
  const report = await generateCategoryReport(userId, period);
  
  let message = `${getText(ctx, 'reports.title')}\n\n`;
  message += `${getText(ctx, 'reports.byCategory')}\n\n`;
  
  if (Object.keys(report).length === 0) {
    message += getText(ctx, 'reports.noData');
  } else {
    // Sort categories by amount (highest first)
    const sortedCategories = Object.entries(report)
      .sort((a, b) => b[1] - a[1]);
    
    sortedCategories.forEach(([category, amount]) => {
      message += `${category}: ${amount.toFixed(2)}\n`;
    });
  }
  
  await ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: getText(ctx, 'back'), callback_data: "report_back" }]
      ]
    }
  });
});

bot.callbackQuery("report_back", async (ctx) => {
  await ctx.answerCallbackQuery();
  await showReportOptions(ctx);
});

// Budget functions
async function showBudgetOptions(ctx) {
  const userId = ctx.from.id.toString();
  const budgets = await getBudgetLimits(userId);
  
  let message = `${getText(ctx, 'budgets.title')}\n\n`;
  message += `${getText(ctx, 'budgets.current')}\n\n`;
  
  if (budgets.length === 0) {
    message += "No budget limits set.";
  } else {
    budgets.forEach(budget => {
      message += `${budget.category}: ${parseFloat(budget.amount).toFixed(2)}\n`;
    });
  }
  
  message += `\n${getText(ctx, 'budgets.set')}`;
  
  const categories = getText(ctx, 'categories.expense');
  const keyboard = [];
  
  // Create rows of 2 buttons each
  for (let i = 0; i < categories.length; i += 2) {
    const row = [];
    row.push({ text: categories[i], callback_data: `budget_${categories[i]}` });
    
    if (i + 1 < categories.length) {
      row.push({ text: categories[i + 1], callback_data: `budget_${categories[i + 1]}` });
    }
    
    keyboard.push(row);
  }
  
  // Add back button
  keyboard.push([{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]);
  
  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

bot.callbackQuery(/^budget_(.+)$/, async (ctx) => {
  const category = ctx.match[1];
  ctx.session.category = category;
  ctx.session.step = 'enter_budget_limit';
  
  await ctx.answerCallbackQuery();
  
  const message = `${getText(ctx, 'budgets.enterLimit')} ${category}:`;
  await ctx.reply(message);
});

// Export functions
async function showExportOptions(ctx) {
  await ctx.reply(getText(ctx, 'export.title'), {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: getText(ctx, 'export.text'), callback_data: "export_text" },
          { text: getText(ctx, 'export.csv'), callback_data: "export_csv" }
        ],
        [{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]
      ]
    }
  });
}

bot.callbackQuery(/^export_(.+)$/, async (ctx) => {
  const format = ctx.match[1];
  await ctx.answerCallbackQuery();
  
  await ctx.reply(getText(ctx, 'export.preparing'));
  
  const userId = ctx.from.id.toString();
  const transactions = await getTransactions(userId);
  
  let exportData;
  let fileName;
  
  if (format === 'text') {
    exportData = exportAsText(transactions, ctx.session.language);
    fileName = 'budget_export.txt';
  } else {
    exportData = exportAsCSV(transactions);
    fileName = 'budget_export.csv';
  }
  
  await ctx.reply(getText(ctx, 'export.ready'));
  
  // Send as a file
  await ctx.replyWithDocument({
    source: Buffer.from(exportData),
    filename: fileName
  });
  
  // Return to main menu
  await showMainMenu(ctx);
});

// Settings
async function showSettings(ctx) {
  await ctx.reply("Settings", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "English 🇬🇧", callback_data: "lang_en" },
          { text: "العربية 🇸🇦", callback_data: "lang_ar" }
        ],
        [{ text: getText(ctx, 'back'), callback_data: "back_to_main" }]
      ]
    }
  });
}

// Initialize database and start the bot
async function startBot() {
  try {
    await initializeDatabase();
    console.log("Database initialized");
    
    // Start the bot
    bot.start();
    console.log("Bot started");
  } catch (error) {
    console.error("Error starting bot:", error);
  }
}

// Export the bot for serverless deployment
export default async function handler(req, res) {
  try {
    // Process the update
    if (req.method === 'POST') {
      const update = req.body;
      await bot.handleUpdate(update);
      res.status(200).json({ ok: true });
    } else {
      // For GET requests, return a simple status
      res.status(200).json({ status: 'Budget Tracker Bot is running!' });
    }
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ error: 'Failed to process update' });
  }
}

// If running directly (not as a serverless function)
if (process.env.NODE_ENV !== 'production') {
  startBot();
}
