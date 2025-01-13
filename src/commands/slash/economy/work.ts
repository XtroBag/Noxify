import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../../handler";
import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { format } from "date-fns";

export = {
  type: CommandTypes.SlashCommand,
  register: RegisterTypes.Global,
  cooldown: 900, // 15 mins (in seconds)

  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work a job to earn some currency")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute({ client, interaction }) {
    const economy = await client.utils.calls.getEconomy({ guildID: interaction.guildId });

    if (!economy) {
      await interaction.reply({
        content: "This server does not have an Economy system set up yet.",
        ephemeral: true,
      });
      return;
    }

    const exists = economy.users.find(
      (user) => user.userID === interaction.member.id
    );

    if (!exists) {
      await client.utils.calls.addEconomyUser({
        guildID: interaction.guildId,
        userID: interaction.member.id,
        displayName: interaction.member.displayName,
        joined: format(new Date(), "eeee, MMMM d, yyyy 'at' h:mm a"),
        accountBalance: economy.defaultBalance,
        bankBalance: 0,
        privacySettings: { receiveNotifications: true, viewInventory: false },
        milestones: [],
        transactions: [],
        inventory: { items: { meal: [], weapon: [], drink: [], ingredient: [] }},
        activeEffects: []
      });
    }

    const updatedEconomy = await client.utils.calls.getEconomy({ guildID: interaction.guildId });
    const user = updatedEconomy.users.find(
      (user) => user.userID === interaction.member.id
    );

    const jobs = [
      { name: "Programmer", description: "developing cutting-edge software" },
      { name: "Builder", description: "constructing buildings and structures" },
      { name: "Waiter", description: "serving food and drinks to customers" },
      {
        name: "Bus Driver",
        description: "transporting passengers across the city",
      },
      { name: "Chef", description: "creating delicious dishes in the kitchen" },
      { name: "Mechanic", description: "fixing and maintaining vehicles" },
      { name: "Doctor", description: "providing medical care to the sick" },
      { name: "Artist", description: "creating beautiful art pieces" },
      { name: "Photographer", description: "capturing moments with a camera" },
      { name: "Reporter", description: "writing stories and news articles" },
      {
        name: "Librarian",
        description: "managing books and assisting visitors",
      },
      {
        name: "Firefighter",
        description: "saving lives and protecting property",
      },
      {
        name: "Teacher",
        description: "educating students in various subjects",
      },
      { name: "Nurse", description: "providing patient care and support" },
      { name: "Lawyer", description: "representing clients in legal matters" },
      { name: "Engineer", description: "designing and building solutions" },
      { name: "Scientist", description: "conducting experiments and research" },
      {
        name: "Actor",
        description: "performing in movies, TV shows, or theater",
      },
      { name: "Musician", description: "creating and performing music" },
      {
        name: "Dancer",
        description: "choreographing and performing dance routines",
      },
      { name: "Pilot", description: "flying aircraft to transport passengers" },
      {
        name: "Architect",
        description: "designing and planning building structures",
      },
      {
        name: "Electrician",
        description: "installing and repairing electrical systems",
      },
      {
        name: "Plumber",
        description: "fixing and maintaining plumbing systems",
      },
      { name: "Farmer", description: "growing crops and raising livestock" },
      {
        name: "Soldier",
        description: "defending the country and maintaining peace",
      },
      {
        name: "Counselor",
        description: "providing guidance and support to others",
      },
      { name: "Judge", description: "making legal decisions in court" },
      {
        name: "Chef",
        description: "preparing and cooking meals in a restaurant",
      },
      {
        name: "Construction Worker",
        description: "building roads, bridges, and other infrastructure",
      },
      {
        name: "Secretary",
        description: "managing office tasks and communications",
      },
      {
        name: "Veterinarian",
        description: "taking care of animals' health and well-being",
      },
      {
        name: "Paramedic",
        description: "providing emergency medical care on the scene",
      },
      {
        name: "Barista",
        description: "preparing and serving coffee and beverages",
      },
      { name: "Hairdresser", description: "cutting and styling hair" },
      {
        name: "Nanny",
        description: "taking care of children and assisting families",
      },
      {
        name: "Designer",
        description: "creating visual concepts for various projects",
      },
      { name: "Baker", description: "baking pastries, bread, and other goods" },
      { name: "Waitress", description: "serving customers in a restaurant" },
      {
        name: "Hotel Manager",
        description: "overseeing the daily operations of a hotel",
      },
      { name: "Zookeeper", description: "taking care of animals in a zoo" },
      {
        name: "Tour Guide",
        description: "guiding tourists to interesting locations",
      },
      {
        name: "Lifeguard",
        description: "ensuring the safety of swimmers at pools or beaches",
      },
      {
        name: "Cashier",
        description: "processing transactions and handling payments",
      },
      {
        name: "Event Planner",
        description: "organizing and coordinating events",
      },
      {
        name: "Social Media Manager",
        description: "managing social media accounts for businesses",
      },
      {
        name: "Project Manager",
        description: "overseeing projects from start to finish",
      },
      {
        name: "Real Estate Agent",
        description: "helping clients buy or sell property",
      },
      {
        name: "Scientist",
        description: "exploring scientific theories and research",
      },
      {
        name: "Therapist",
        description: "providing mental health counseling and support",
      },
      { name: "Nutritionist", description: "advising on food and health" },
      {
        name: "Driver",
        description: "transporting goods and people to their destinations",
      },
      {
        name: "Personal Trainer",
        description: "helping clients achieve their fitness goals",
      },
      {
        name: "Makeup Artist",
        description: "applying makeup to clients for various occasions",
      },
      {
        name: "Interior Designer",
        description: "designing and decorating interior spaces",
      },
      {
        name: "Landscaper",
        description: "designing and maintaining outdoor areas",
      },
      {
        name: "DJ",
        description: "creating music mixes and performing at events",
      },
      {
        name: "Author",
        description: "writing and publishing books or articles",
      },
      {
        name: "Translator",
        description: "translating languages for communication",
      },
      { name: "Barber", description: "cutting and styling hair for men" },
      {
        name: "Photographer",
        description: "capturing moments for events or clients",
      },
      {
        name: "Bartender",
        description: "serving drinks and cocktails to customers",
      },
      {
        name: "Teacher's Assistant",
        description: "helping the teacher with classroom activities",
      },
      {
        name: "Housekeeper",
        description: "cleaning and maintaining homes or hotels",
      },
      {
        name: "Salesperson",
        description: "selling products and services to customers",
      },
      {
        name: "Fitness Coach",
        description: "guiding clients through fitness routines",
      },
    ];

    const jobIndex = Math.floor(Math.random() * jobs.length);
    const job = jobs[jobIndex];
    const gained = Math.floor(Math.random() * 270) + 1;

    const newBankBalance = user.bankBalance + gained;

    await client.utils.calls.updateUserBankBalance({
      guildID: interaction.guildId,
      userID: interaction.member.id,
      bankBalance: newBankBalance,
    });

    const article = ["A", "E", "I", "O", "U"].includes(
      job.name.charAt(0).toUpperCase()
    )
      ? "an"
      : "a";

    await interaction.reply({
      content: `You landed a job as ${article} **${
        job.name
      }**, where you were in charge of ${
        job.description
      }. You've earned ${client.utils.extras.formatAmount(gained)} ${updatedEconomy.name
        .toLowerCase()
        .replace(/s$/, "")}${gained === 1 ? "" : "s"}!`,
    });
  },
} as SlashCommandModule;
