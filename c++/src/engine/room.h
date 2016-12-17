#ifndef __GAME_ROOM_H__
#define __GAME_ROOM_H__

#include <memory>
#include <vector>

#include "engine.h"
#include "object.h"
#include "event.h"

namespace Game {
    class TileMap;
    class Room {
        std::vector<std::unique_ptr<Object>> _objects;
        std::unique_ptr<TileMap> _tilemap;
        Engine &_eng;
    protected:
        Room(int id, Engine & eng);
    public:
        const int id;
        virtual ~Room() = 0;
        // start the room
        virtual void start();
        // process an event
        virtual void proc(const Event &event);
        // draw all objects
        virtual void draw(Draw &draw);
        // end the room
        virtual void end();

        template<typename T, typename ... Args>
        void spawn(Args ... args);
        template<typename T>
        void destroy();
        void destroy(Object & who);

        template<typename T>
        bool collides(const Rectangle & where) const;
        bool collides(const Rectangle & where) const;
        Dimension size() const;
    };

    template<typename T, typename ... Args>
    void Room::spawn(Args ... args) {
        if(T::persistent) {
            _eng.spawn<T>(args ...);
        } else {
            _objects.emplace_back(std::make_unique<T>(args ...));
        }
    }

    template<typename T>
    void Room::destroy() {
        for(auto i = _objects.begin(); i != _objects.end();) {
            if(dynamic_cast<T *>(i->get())) {
                i = _objects.erase(i);
            } else {
                ++i;
            }
        }
        _eng.destroy<T>();
    }

    template<typename T>
    bool Room::collides(const Rectangle & where) const {
        for(auto &o : _objects) {
            if(auto b = dynamic_cast<const T *> (o.get())) {
                if(b->collides(where)) {
                    return true;
                }
            }
        }
        return false;
    }
};

#endif