import AccountOverview from "../components/AccountComponents/AccountOverview";
import Home from "../components/HomeComponents/Home";
import ProductsPage from "../components/HomeComponents/ProductsPage";
import ProductPage from "../components/ProductComponents/ProductPage";

export default [
    { path: '/acasa', name: 'Acasă', Component: Home },
    { path: '/contul-meu', name: 'Contul meu', Component: AccountOverview },
    { path: '/categorii/:category', name: 'Categorii', Component: ProductsPage },
    { path: '/categorii/:category/:subcategory1', name: 'Subcategorii1', Component: ProductsPage },
    { path: '/categorii/:category/:subcategory1/:subcategory2', name: 'Subcategorii2', Component: ProductsPage },
    { path: '/categorii/:category/:subcategory1/:subcategory2/:product', name: 'Produs', Component: ProductPage },
    { path: '/categorii/:category/:subcategory1/:product', name: 'Produs', Component: ProductPage },
    { path: '/categorii/:category/:product', name: 'Produs', Component: ProductPage },
]

