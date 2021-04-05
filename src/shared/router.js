import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import FavoritePage from '../pages/FavoritePage';
import ErrorPage from '../pages/ErrorPage';
import QuizPage from '../pages/QuizPage';
import MonsterDetailPage from '../pages/MonsterDetailPage';

const routes = 
[
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/favorite',
    name: 'FavoritePage',
    component: FavoritePage
  },
  {
    path: '/quiz',
    name: 'QuizPage',
    component: QuizPage
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage
  },
  {
    path: '/monster/:url_id',
    name: 'MonsterDetailPage',
    component: MonsterDetailPage,
    props: true
  },
  {
    path: '/:catchAll(.*)',
    name: 'ErrorPage',
    component: ErrorPage
  }
];

const router = createRouter(
{
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;