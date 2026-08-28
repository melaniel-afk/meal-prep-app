import { createClient } from "@/lib/supabase/server";
import { CATEGORY_ORDER, type ShoppingListItem } from "@/lib/types";
import ShoppingItemRow from "@/components/ShoppingItemRow";

export default async function ListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shopping_list_items")
    .select("*")
    .order("created_at", { ascending: true });

  const items = (data as ShoppingListItem[]) || [];
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="max-w-lg">
      <div className="flex items-start justify-between gap-5 mb-6">
        <div>
          <h1 className="mp-title mb-1">Shopping List</h1>
          <p className="mp-text">
            {checkedCount} of {items.length} items checked off
          </p>
        </div>
        <button
          disabled
          title="Retailer checkout is coming in a later phase"
          className="min-h-11 px-5 rounded-full bg-[#E6DBF2] text-[#8A7A9C] text-[13.5px] font-semibold whitespace-nowrap cursor-not-allowed"
        >
          Order Online (Coming Soon)
        </button>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (!catItems.length) return null;
        return (
          <div key={cat} className="mb-5.5" style={{ marginBottom: 22 }}>
            <h3 className="mp-subheading uppercase tracking-wide mb-2.5" style={{ color: "#8A7A9C" }}>
              {cat}
            </h3>
            <div className="bg-[#FFFDFB] rounded-2xl px-4.5" style={{ paddingLeft: 18, paddingRight: 18 }}>
              {catItems.map((item) => (
                <ShoppingItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}

      {!items.length && (
        <p className="mp-text">Your list is empty — add ingredients from a recipe to get started.</p>
      )}
    </div>
  );
}
