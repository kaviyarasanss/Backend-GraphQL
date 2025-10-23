import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("albums").del();
  await knex("posts").del();
  await knex("users").del();

  const users = [
    { name: "Alice Johnson", username: "alice", email: "alice@example.com" },
    { name: "Bob Smith", username: "bob", email: "bob@example.com" },
    {
      name: "Charlie Brown",
      username: "charlie",
      email: "charlie@example.com",
    },
    { name: "David Lee", username: "david", email: "david@example.com" },
    { name: "Eva Green", username: "eva", email: "eva@example.com" },
    { name: "Frank White", username: "frank", email: "frank@example.com" },
    { name: "Grace Kim", username: "grace", email: "grace@example.com" },
    { name: "Hannah Adams", username: "hannah", email: "hannah@example.com" },
    { name: "Ian Clark", username: "ian", email: "ian@example.com" },
    { name: "Julia Turner", username: "julia", email: "julia@example.com" },
  ];

  const insertedUsers = await knex("users").insert(users).returning("*");

  const posts = [
    {
      user_id: insertedUsers[0].id,
      title: "Welcome to my blog",
      content: "This is Alice’s first post.",
      caption: "Excited to start blogging!",
    },
    {
      user_id: insertedUsers[0].id,
      title: "My second post",
      content: "Sharing more thoughts on web development.",
      caption: "Learning is fun!",
    },
    {
      user_id: insertedUsers[1].id,
      title: "Bob’s tips",
      content: "Tips for Node.js beginners.",
      caption: "Keep coding!",
    },
    {
      user_id: insertedUsers[1].id,
      title: "Advanced JavaScript",
      content: "Deep dive into JS closures.",
      caption: "Closures explained.",
    },
    {
      user_id: insertedUsers[2].id,
      title: "Charlie’s adventures",
      content: "Travel stories and experiences.",
      caption: "Travel diary.",
    },
    {
      user_id: insertedUsers[3].id,
      title: "David’s tech review",
      content: "Reviewing latest laptops.",
      caption: "Tech insights.",
    },
    {
      user_id: insertedUsers[4].id,
      title: "Eva’s recipes",
      content: "Easy pasta recipes for beginners.",
      caption: "Cooking time!",
    },
    {
      user_id: insertedUsers[5].id,
      title: "Frank’s music tips",
      content: "How to play guitar like a pro.",
      caption: "Music lessons.",
    },
    {
      user_id: insertedUsers[6].id,
      title: "Grace’s fitness",
      content: "Workout routines for home.",
      caption: "Stay healthy.",
    },
    {
      user_id: insertedUsers[7].id,
      title: "Hannah’s art",
      content: "Painting techniques for beginners.",
      caption: "Express yourself.",
    },
    {
      user_id: insertedUsers[8].id,
      title: "Ian’s coding journey",
      content: "From zero to developer.",
      caption: "Keep learning!",
    },
    {
      user_id: insertedUsers[9].id,
      title: "Julia’s photography",
      content: "Tips for capturing landscapes.",
      caption: "Capture the moment.",
    },
  ];

  await knex("posts").insert(posts);

  const albums = [
    {
      user_id: insertedUsers[0].id,
      name: "Alice's Memories",
      description: "Photos from my life.",
      genre: "Personal",
    },
    {
      user_id: insertedUsers[0].id,
      name: "Alice’s Travel",
      description: "Vacation photos.",
      genre: "Travel",
    },
    {
      user_id: insertedUsers[1].id,
      name: "Bob’s Coding",
      description: "Screenshots of my projects.",
      genre: "Tech",
    },
    {
      user_id: insertedUsers[1].id,
      name: "Bob’s Music",
      description: "Guitar performances.",
      genre: "Music",
    },
    {
      user_id: insertedUsers[2].id,
      name: "Charlie’s Adventures",
      description: "Travel albums.",
      genre: "Travel",
    },
    {
      user_id: insertedUsers[3].id,
      name: "David’s Reviews",
      description: "Tech product photos.",
      genre: "Tech",
    },
    {
      user_id: insertedUsers[4].id,
      name: "Eva’s Recipes",
      description: "Food photography.",
      genre: "Food",
    },
    {
      user_id: insertedUsers[5].id,
      name: "Frank’s Music Lessons",
      description: "Guitar tutorials.",
      genre: "Music",
    },
    {
      user_id: insertedUsers[6].id,
      name: "Grace’s Fitness",
      description: "Workout progress photos.",
      genre: "Fitness",
    },
    {
      user_id: insertedUsers[7].id,
      name: "Hannah’s Art",
      description: "Paintings and sketches.",
      genre: "Art",
    },
    {
      user_id: insertedUsers[8].id,
      name: "Ian’s Coding",
      description: "Project screenshots.",
      genre: "Tech",
    },
    {
      user_id: insertedUsers[9].id,
      name: "Julia’s Photography",
      description: "Nature photos.",
      genre: "Photography",
    },
  ];

  await knex("albums").insert(albums);

  console.log(
    `Seeded ${users.length} users, ${posts.length} posts, ${albums.length} albums`
  );
}
