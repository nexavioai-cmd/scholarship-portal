await supabase.from("scholarships").insert({
  name,
  provider,
  country,
  level,
  funding_type,
  deadline,
  amount: amount ? Number(amount) : null,
});
router.push("/admin");