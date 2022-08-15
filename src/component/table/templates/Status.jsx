import React from "react";

export default function Status(props) {
  if (props?.quantity > 0 && props?.quantity > (props.qtyAlert ?? 1))
    return <p className="capitalize text-center rounded-3xl px-1 py-1 bg-emerald-100 text-emerald-600">En Stock</p>;
  if (props?.quantity === 0) return <p className="capitalize text-center rounded-3xl px-1 py-2 bg-rose-100 text-rose-500">En Rupture</p>;
  if (props?.quantity > 0 && props?.quantity <= props?.qtyAlert) return <p className="capitalize text-center rounded-3xl px-1 py-2 bg-amber-100 text-amber-600">En Alerte</p>;
}
