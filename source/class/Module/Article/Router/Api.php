<?php


namespace Planck\Extension\Content\Module\Article\Router;


use Planck\Exception;
use Planck\Extension\Content\Module\Article\Controller\Save;
use Planck\Extension\RichTag\Model\Repository\Tag;
use Planck\Extension\ViewComponent\DataLayer;
use Planck\Routing\Router;
use Planck\Extension\Content\Model\Entity\Article;



class Api extends Router
{



    public function registerRoutes()
    {



        $this->post('save-tags', '`content/article/api/save-tags`', function() {

            $data = $this->post();


            $article = $data['article'];
            $tags = $data['tags'];

            $tagManager = $this->application->getModelRepository(Tag::class);
            $articleInstance = $this->application->getModelEntity(Article::class);
            $articleInstance->loadById($article['id']);

            $errors = [];
            $tagsToAssociate = [];

            foreach ($tags as $tag) {
                if((int) $tag) {
                    try {
                        $tagEntity = $tagManager->getById($tag);
                        $tagsToAssociate[] = $tagEntity;
                    }
                    catch(Exception $exception) {
                        $errors[] = 'tag with id ['.$tag.'] does not exist';
                    }
                }
                else {
                    $tagEntity = $tagManager->createIfNotExists($tag);
                    $tagsToAssociate[] = $tagEntity;
                }
            }

            $tagManager->clearTagsForEntity($articleInstance);
            foreach ($tagsToAssociate as $tag) {
                $tagManager->tagEntity($articleInstance, $tag);
            }


            echo json_encode($data);

        })->json();



        $this->post('save', '`content/article/save`', function() {


            $data = $this->post();

            $controller = new Save();
            $article = $controller->execute($data['entity']);


            $redirection = $this->request->get('redirection');
            if($redirection && !$this->request->data('no-redirection')) {
                $this->redirect($redirection.'&article='.$article->getId());
            }
            else {

                $dataLayer = new DataLayer();
                echo json_encode(
                    $dataLayer->serializeValue($article)
                );
            }


        })->json()


        ->setBuilder(function($redirection = false) {
            $url = '/content/article/save';
            if($redirection) {
                $url .= '&redirection='.rawurlencode($redirection);
            }
            return $url;
        });
        ;







        return parent::registerRoutes();
    }

}